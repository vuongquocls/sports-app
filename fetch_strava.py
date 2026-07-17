import os
import json
import time
import requests

CREDENTIALS_FILE = "strava_api_credentials.txt"
OUTPUT_FILE = "strava_activities_3m.json"

def load_credentials():
    creds = {}
    if not os.path.exists(CREDENTIALS_FILE):
        raise FileNotFoundError(f"Missing {CREDENTIALS_FILE} file in workspace.")
    with open(CREDENTIALS_FILE, "r") as f:
        for line in f:
            if ":" in line:
                key, val = line.split(":", 1)
                creds[key.strip().lower().replace(" ", "_")] = val.strip()
    return creds

def save_credentials(creds):
    with open(CREDENTIALS_FILE, "w") as f:
        f.write(f"Client ID: {creds['client_id']}\n")
        f.write(f"Client Secret: {creds['client_secret']}\n")
        f.write(f"Access Token: {creds['access_token']}\n")
        f.write(f"Refresh Token: {creds['refresh_token']}\n")

def refresh_tokens(creds):
    print("Refreshing access token...")
    payload = {
        "client_id": creds["client_id"],
        "client_secret": creds["client_secret"],
        "grant_type": "refresh_token",
        "refresh_token": creds["refresh_token"]
    }
    response = requests.post("https://www.strava.com/api/v3/oauth/token", data=payload)
    if response.status_code != 200:
        raise Exception(f"Failed to refresh token: {response.text}")
    
    data = response.json()
    creds["access_token"] = data["access_token"]
    creds["refresh_token"] = data["refresh_token"]
    save_credentials(creds)
    print("Tokens refreshed and saved successfully.")
    return creds["access_token"]

def fetch_activities(access_token):
    # Calculate epoch timestamp for 90 days ago
    days_ago_90 = int(time.time()) - (90 * 24 * 60 * 60)
    print(f"Fetching activities since epoch: {days_ago_90} ({time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(days_ago_90))})")
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    params = {
        "after": days_ago_90,
        "per_page": 200
    }
    
    response = requests.get("https://www.strava.com/api/v3/athlete/activities", headers=headers, params=params)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch activities: {response.text}")
        
    activities = response.json()
    print(f"Successfully fetched {len(activities)} activities.")
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(activities, f, indent=2, ensure_ascii=False)
    print(f"Activities saved to {OUTPUT_FILE}")

def main():
    try:
        creds = load_credentials()
        access_token = refresh_tokens(creds)
        fetch_activities(access_token)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
