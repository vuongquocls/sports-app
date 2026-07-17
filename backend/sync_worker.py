import os
import time
import requests
from cryptography.fernet import Fernet
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials, firestore

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

def decrypt_token(token_enc: str) -> str:
    return fernet.decrypt(token_enc.encode()).decode()

def encrypt_token(token: str) -> str:
    return fernet.encrypt(token.encode()).decode()

def sync_user_activities(uid: str, cred_ref):
    print(f"Syncing activities for user: {uid}...")
    cred_snap = cred_ref.get()
    if not cred_snap.exists:
        print(f"No credentials found for user: {uid}")
        return

    cred_data = cred_snap.to_dict()
    refresh_token = decrypt_token(cred_data.get("refreshTokenEnc"))
    expires_at = cred_data.get("expiresAt", 0)
    access_token_enc = cred_data.get("accessTokenEnc")

    # Determine if we need to refresh token (if expired or expiring in less than 5 minutes)
    current_time = int(time.time())
    access_token = ""
    
    if current_time >= (expires_at - 300) or not access_token_enc:
        print(f"Refreshing access token for user: {uid}...")
        strava_token_url = "https://www.strava.com/oauth/token"
        payload = {
            "client_id": os.getenv("STRAVA_CLIENT_ID"),
            "client_secret": os.getenv("STRAVA_CLIENT_SECRET"),
            "refresh_token": refresh_token,
            "grant_type": "refresh_token"
        }
        res = requests.post(strava_token_url, data=payload)
        if res.status_code != 200:
            print(f"Failed to refresh token for user {uid}: {res.text}")
            return
        
        res_data = res.json()
        access_token = res_data.get("access_token")
        new_refresh_token = res_data.get("refresh_token")
        new_expires_at = res_data.get("expires_at")

        # Save refreshed tokens
        cred_ref.update({
            "accessTokenEnc": encrypt_token(access_token),
            "refreshTokenEnc": encrypt_token(new_refresh_token),
            "expiresAt": new_expires_at,
            "updatedAt": firestore.SERVER_TIMESTAMP
        })
    else:
        access_token = decrypt_token(access_token_enc)

    # Fetch last 3 days of activities to capture recent updates
    epoch_3_days_ago = int(time.time()) - (3 * 24 * 3600)
    
    headers = {"Authorization": f"Bearer {access_token}"}
    activities_url = f"https://www.strava.com/api/v3/athlete/activities?after={epoch_3_days_ago}&per_page=50"
    
    res = requests.get(activities_url, headers=headers)
    if res.status_code != 200:
        print(f"Failed to fetch activities for user {uid}: {res.text}")
        return

    activities = res.json()
    print(f"Fetched {len(activities)} activities for user: {uid}")

    # Write activities in a batch
    batch = db.batch()
    for act in activities:
        act_id = str(act.get("id"))
        act_ref = db.collection("users").document(uid).collection("activities").document(act_id)
        
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
    batch.commit()
    print(f"Successfully synced activities for user: {uid}")

def main():
    print("Starting multi-user Strava sync process...")
    # List all users
    users_ref = db.collection("users")
    users = users_ref.stream()

    for user in users:
        uid = user.id
        cred_ref = users_ref.document(uid).collection("strava_credentials").document("default")
        try:
            if cred_ref.get().exists:
                sync_user_activities(uid, cred_ref)
        except Exception as e:
            print(f"Error syncing user {uid}: {str(e)}")
            
    print("Multi-user Strava sync completed successfully.")

if __name__ == "__main__":
    main()
