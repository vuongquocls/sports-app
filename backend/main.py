import os
import requests
import base64
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from cryptography.fernet import Fernet
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials, auth, firestore

# Path of service account key
cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase_key.json")
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Initialize Encryption
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    raise ValueError("ENCRYPTION_KEY environment variable is not set!")
fernet = Fernet(ENCRYPTION_KEY.encode())

def encrypt_token(token: str) -> str:
    return fernet.encrypt(token.encode()).decode()

def decrypt_token(token_enc: str) -> str:
    return fernet.decrypt(token_enc.encode()).decode()

app = FastAPI(title="Sports App Multi-User Backend", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to the domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StravaAuthRequest(BaseModel):
    code: str

@app.get("/api/health")
def health():
    return {"status": "ok", "project": os.getenv("FIREBASE_PROJECT_ID")}

@app.post("/api/auth/strava")
def auth_strava(req: StravaAuthRequest):
    code = req.code
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code is missing.")

    # Exchange authorization code for tokens
    strava_token_url = "https://www.strava.com/oauth/token"
    payload = {
        "client_id": os.getenv("STRAVA_CLIENT_ID"),
        "client_secret": os.getenv("STRAVA_CLIENT_SECRET"),
        "code": code,
        "grant_type": "authorization_code"
    }

    try:
        res = requests.post(strava_token_url, data=payload)
        res_data = res.json()
        if res.status_code != 200:
            raise HTTPException(status_code=400, detail=res_data.get("message", "Failed to exchange token with Strava."))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Strava authentication failed: {str(e)}")

    athlete = res_data.get("athlete")
    if not athlete:
        raise HTTPException(status_code=400, detail="Athlete data not found in Strava response.")

    athlete_id = str(athlete.get("id"))
    uid = f"strava_{athlete_id}"

    # Encrypt tokens
    access_token_enc = encrypt_token(res_data.get("access_token"))
    refresh_token_enc = encrypt_token(res_data.get("refresh_token"))
    expires_at = res_data.get("expires_at")
    scope = "activity:read_all"

    # Store credentials securely in Firestore
    cred_ref = db.collection("users").document(uid).collection("strava_credentials").document("default")
    cred_ref.set({
        "accessTokenEnc": access_token_enc,
        "refreshTokenEnc": refresh_token_enc,
        "expiresAt": expires_at,
        "scope": scope,
        "athleteId": athlete_id,
        "updatedAt": firestore.SERVER_TIMESTAMP
    })

    # Update or set basic profile
    profile_ref = db.collection("users").document(uid)
    profile_snap = profile_ref.get()
    
    first_name = athlete.get("firstname", "")
    last_name = athlete.get("lastname", "")
    display_name = f"{first_name} {last_name}".strip() or f"Athlete #{athlete_id}"
    
    if not profile_snap.exists:
        profile_ref.set({
            "profile": {
                "displayName": display_name,
                "weight": 70,  # default
                "targetWeight": 65,  # default
                "targetPace": "6:00",  # default
                "createdAt": firestore.SERVER_TIMESTAMP
            }
        })
    else:
        # Update display name if profile exists but does not have it
        data = profile_snap.to_dict()
        if "profile" not in data or "displayName" not in data["profile"]:
            profile_ref.update({
                "profile.displayName": display_name
            })

    # Mint Firebase Custom Token
    try:
        custom_token = auth.create_custom_token(uid)
        # Firebase Custom Token is a bytes object, decode to string
        custom_token_str = custom_token.decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Firebase Custom Token: {str(e)}")

    return {
        "firebaseCustomToken": custom_token_str,
        "uid": uid,
        "athlete": {
            "id": athlete_id,
            "firstname": first_name,
            "lastname": last_name,
            "profile_medium": athlete.get("profile_medium", "")
        }
    }

class BackfillRequest(BaseModel):
    uid: str

@app.post("/api/sync/backfill")
def backfill_activities(req: BackfillRequest):
    uid = req.uid
    
    # Retrieve credentials from Firestore
    cred_ref = db.collection("users").document(uid).collection("strava_credentials").document("default")
    cred_snap = cred_ref.get()
    if not cred_snap.exists:
        raise HTTPException(status_code=404, detail="Strava credentials not found for this user.")

    cred_data = cred_snap.to_dict()
    refresh_token = decrypt_token(cred_data.get("refreshTokenEnc"))
    
    # Refresh Access Token
    strava_token_url = "https://www.strava.com/oauth/token"
    payload = {
        "client_id": os.getenv("STRAVA_CLIENT_ID"),
        "client_secret": os.getenv("STRAVA_CLIENT_SECRET"),
        "refresh_token": refresh_token,
        "grant_type": "refresh_token"
    }

    try:
        res = requests.post(strava_token_url, data=payload)
        res_data = res.json()
        if res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to refresh token with Strava.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token refresh failed: {str(e)}")

    access_token = res_data.get("access_token")
    
    # Update new tokens in Firestore
    cred_ref.update({
        "accessTokenEnc": encrypt_token(access_token),
        "refreshTokenEnc": encrypt_token(res_data.get("refresh_token")),
        "expiresAt": res_data.get("expires_at"),
        "updatedAt": firestore.SERVER_TIMESTAMP
    })

    # Fetch last 30 days of activities from Strava
    import time
    epoch_30_days_ago = int(time.time()) - (30 * 24 * 3600)
    
    headers = {"Authorization": f"Bearer {access_token}"}
    activities_url = f"https://www.strava.com/api/v3/athlete/activities?after={epoch_30_days_ago}&per_page=100"
    
    try:
        act_res = requests.get(activities_url, headers=headers)
        if act_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch activities from Strava.")
        activities = act_res.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch activities: {str(e)}")

    # Write activities to Firestore
    batch = db.batch()
    count = 0
    for act in activities:
        act_id = str(act.get("id"))
        act_ref = db.collection("users").document(uid).collection("activities").document(act_id)
        
        # Parse fields
        sport_type = act.get("sport_type") or act.get("type", "Run")
        distance = act.get("distance", 0.0)
        moving_time = act.get("moving_time", 0)
        start_date = act.get("start_date")
        start_date_local = act.get("start_date_local")
        name = act.get("name", "Activity")
        
        batch.set(act_ref, {
            "id": act_id,
            "name": name,
            "type": act.get("type", "Run"),
            "sport_type": sport_type,
            "distance": distance,
            "moving_time": moving_time,
            "start_date": start_date,
            "start_date_local": start_date_local,
            "updatedAt": firestore.SERVER_TIMESTAMP
        })
        count += 1
        
        # Firestore batch size limit is 500
        if count >= 400:
            batch.commit()
            batch = db.batch()
            count = 0
            
    if count > 0:
        batch.commit()

    return {"status": "success", "fetched": len(activities)}
