import json
import os

INPUT_FILE = "strava_activities_3m.json"

def format_pace(speed_m_per_s):
    # speed is in meters per second
    if speed_m_per_s <= 0:
        return "N/A"
    # pace is minutes per kilometer
    # 1000 meters / (speed * 60)
    min_per_km = 1000.0 / (speed_m_per_s * 60.0)
    minutes = int(min_per_km)
    seconds = int((min_per_km - minutes) * 60)
    return f"{minutes}:{seconds:02d}/km"

def format_duration(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    return f"{hours}h {minutes}m"

def analyze_activities():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: {INPUT_FILE} not found. Please run fetch_strava.py first.")
        return

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        activities = json.load(f)

    runs = []
    swims = []
    others = []

    for act in activities:
        # Strava uses 'type' or 'sport_type'
        sport = act.get("sport_type", act.get("type", ""))
        if sport == "Run":
            runs.append(act)
        elif sport == "Swim":
            swims.append(act)
        else:
            others.append(act)

    print("==================================================")
    print("           STRAVA 3-MONTH TRAINING ANALYSIS        ")
    print("==================================================")

    # 1. RUNNING ANALYSIS
    print(f"\n--- RUNNING SUMMARY ({len(runs)} activities) ---")
    if runs:
        total_dist_m = sum(r.get("distance", 0) for r in runs)
        total_time_s = sum(r.get("moving_time", 0) for r in runs)
        total_dist_km = total_dist_m / 1000.0
        
        avg_speed = total_dist_m / total_time_s if total_time_s > 0 else 0
        avg_pace = format_pace(avg_speed)
        
        longest_run = max(runs, key=lambda r: r.get("distance", 0))
        longest_dist_km = longest_run.get("distance", 0) / 1000.0
        longest_pace = format_pace(longest_run.get("distance", 0) / longest_run.get("moving_time", 1))
        longest_date = longest_run.get("start_date_local", "")[:10]

        # Calculate weekly averages (approx 13 weeks in 3 months)
        weeks = 90.0 / 7.0
        weekly_dist = total_dist_km / weeks
        weekly_freq = len(runs) / weeks
        
        # Best pace for a run >= 5km
        runs_gte_5k = [r for r in runs if r.get("distance", 0) >= 5000]
        if runs_gte_5k:
            best_run_5k = max(runs_gte_5k, key=lambda r: r.get("average_speed", 0))
            best_pace_5k = format_pace(best_run_5k.get("average_speed", 0))
            best_dist_5k = best_run_5k.get("distance", 0) / 1000.0
        else:
            best_pace_5k = "N/A"
            best_dist_5k = 0

        # Heart rate stats if available
        hr_runs = [r for r in runs if "average_heartrate" in r]
        if hr_runs:
            avg_hr = sum(r["average_heartrate"] for r in hr_runs) / len(hr_runs)
            max_hr = max(r.get("max_heartrate", 0) for r in hr_runs)
            hr_str = f"Avg HR: {avg_hr:.1f} bpm, Max HR: {max_hr} bpm"
        else:
            hr_str = "Heart Rate: N/A (no HR sensor or data)"

        print(f"• Total Distance: {total_dist_km:.2f} km")
        print(f"• Total Duration: {format_duration(total_time_s)}")
        print(f"• Overall Average Pace: {avg_pace}")
        print(f"• Weekly Averages: {weekly_dist:.2f} km/week, {weekly_freq:.1f} runs/week")
        print(f"• Longest Run: {longest_dist_km:.2f} km @ {longest_pace} on {longest_date}")
        print(f"• Best Pace (>= 5km): {best_pace_5k} (on a {best_dist_5k:.2f} km run)")
        print(f"• {hr_str}")
    else:
        print("No running activities recorded in the last 3 months.")

    # 2. SWIMMING ANALYSIS
    print(f"\n--- SWIMMING SUMMARY ({len(swims)} activities) ---")
    if swims:
        total_swim_m = sum(s.get("distance", 0) for s in swims)
        total_swim_time_s = sum(s.get("moving_time", 0) for s in swims)
        
        # Swim pace is usually expressed per 100m
        # speed_m_per_s -> 100m / speed
        avg_swim_speed = total_swim_m / total_swim_time_s if total_swim_time_s > 0 else 0
        if avg_swim_speed > 0:
            sec_per_100m = 100.0 / avg_swim_speed
            swim_pace_min = int(sec_per_100m // 60)
            swim_pace_sec = int(sec_per_100m % 60)
            avg_swim_pace = f"{swim_pace_min}:{swim_pace_sec:02d}/100m"
        else:
            avg_swim_pace = "N/A"

        longest_swim = max(swims, key=lambda s: s.get("distance", 0))
        longest_swim_m = longest_swim.get("distance", 0)
        longest_swim_date = longest_swim.get("start_date_local", "")[:10]

        print(f"• Total Distance: {total_swim_m:.0f} m")
        print(f"• Total Duration: {format_duration(total_swim_time_s)}")
        print(f"• Overall Average Pace: {avg_swim_pace}")
        print(f"• Average Swim Distance: {total_swim_m / len(swims):.0f} m")
        print(f"• Longest Swim: {longest_swim_m:.0f} m on {longest_swim_date}")
    else:
        print("No swimming activities recorded in the last 3 months.")

    # 3. OTHER ACTIVITIES
    if others:
        print(f"\n--- OTHER SPORTS SUMMARY ({len(others)} activities) ---")
        sport_counts = {}
        for act in others:
            sport = act.get("sport_type", act.get("type", ""))
            sport_counts[sport] = sport_counts.get(sport, 0) + 1
        for sport, count in sport_counts.items():
            print(f"• {sport}: {count} activities")

    print("\n==================================================")

if __name__ == "__main__":
    analyze_activities()
