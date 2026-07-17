import os
import json
import time
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
fernet = Fernet(ENCRYPTION_KEY.encode())

def encrypt_token(token: str) -> str:
    return fernet.encrypt(token.encode()).decode()

def migrate():
    # User ID based on their athlete ID 18395567
    athlete_id = "18395567"
    uid = f"strava_{athlete_id}"
    print(f"Migrating data for user UID: {uid}...")

    # 1. Migrate credentials
    access_token = "661a93cd93c42a04f36c5fd7cd7402422585dc39"
    refresh_token = "e879584d94ef8e414cd45ba7fbcd1af2fb048ea9"
    
    cred_ref = db.collection("users").document(uid).collection("strava_credentials").document("default")
    cred_ref.set({
        "accessTokenEnc": encrypt_token(access_token),
        "refreshTokenEnc": encrypt_token(refresh_token),
        "expiresAt": int(time.time()) + 3600 * 5,  # mock future expiration
        "scope": "activity:read_all",
        "athleteId": athlete_id,
        "updatedAt": firestore.SERVER_TIMESTAMP
    })
    print("Credentials migrated successfully.")

    # 2. Migrate profile info
    profile_ref = db.collection("users").document(uid)
    profile_ref.set({
        "profile": {
            "displayName": "Vương Quốc",
            "weight": 68,
            "targetWeight": 62,
            "targetPace": "4:30",  # HM 1:35
            "createdAt": firestore.SERVER_TIMESTAMP
        }
    })
    print("Profile migrated successfully.")

    # 3. Migrate historical activities from json file
    json_path = "../sports-app/strava_activities_3m.json"
    if os.path.exists(json_path):
        print(f"Loading activities from {json_path}...")
        with open(json_path, "r", encoding="utf-8") as f:
            activities = json.load(f)
        
        batch = db.batch()
        count = 0
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
            count += 1
            
            if count >= 400:
                batch.commit()
                batch = db.batch()
                count = 0
                
        if count > 0:
            batch.commit()
        print(f"Successfully migrated {len(activities)} activities.")
    else:
        print(f"Activities file not found at {json_path}, skipping activities migration.")

    print("Migration completed successfully!")

if __name__ == "__main__":
    migrate()
