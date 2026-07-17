import os
import sys
import requests

CREDENTIALS_FILE = "strava_api_credentials.txt"

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

def exchange_code(code):
    creds = load_credentials()
    print("Exchanging authorization code for tokens...")
    payload = {
        "client_id": creds["client_id"],
        "client_secret": creds["client_secret"],
        "code": code,
        "grant_type": "authorization_code"
    }
    response = requests.post("https://www.strava.com/api/v3/oauth/token", data=payload)
    if response.status_code != 200:
        raise Exception(f"Failed to exchange code: {response.text}")
    
    data = response.json()
    creds["access_token"] = data["access_token"]
    creds["refresh_token"] = data["refresh_token"]
    save_credentials(creds)
    print("Tokens successfully received and updated in credentials file!")
    print(f"Athlete: {data.get('athlete', {}).get('firstname', '')} {data.get('athlete', {}).get('lastname', '')}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python exchange_code.py <code>")
        sys.exit(1)
    
    code_input = sys.argv[1]
    # In case user pasted the whole redirect URL
    if "code=" in code_input:
        # Extract code from URL
        parts = code_input.split("code=")
        code = parts[1].split("&")[0]
    else:
        code = code_input
        
    try:
        exchange_code(code)
    except Exception as e:
        print(f"Error: {e}")
