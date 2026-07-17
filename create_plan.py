import datetime

def get_event_template(uid, date_str, summary, description, start_hour=7):
    # date_str format: YYYY-MM-DD
    year, month, day = map(int, date_str.split("-"))
    dt_start = datetime.datetime(year, month, day, start_hour, 0)
    dt_end = dt_start + datetime.timedelta(hours=1)
    
    dtstamp = datetime.datetime.now(datetime.UTC).strftime("%Y%m%dT%H%M%SZ")
    dtstart_str = dt_start.strftime("%Y%m%dT%H%M%S")
    dtend_str = dt_end.strftime("%Y%m%dT%H%M%S")
    
    # Escape description for ICS format
    desc_escaped = description.replace("\n", "\\n").replace(",", "\\,")
    
    return f"""BEGIN:VEVENT
UID:{uid}@antigravity.sports.expert
DTSTAMP:{dtstamp}
DTSTART;TZID=Asia/Ho_Chi_Minh:{dtstart_str}
DTEND;TZID=Asia/Ho_Chi_Minh:{dtend_str}
SUMMARY:{summary}
DESCRIPTION:{desc_escaped}
END:VEVENT
"""

def generate_plan():
    # Start date: 2026-07-20 (Monday)
    start_date = datetime.date(2026, 7, 20)
    
    # 8 weeks of workouts in Vietnamese with new schedule
    weeks_data = [
        # WEEK 1 (Odd week: Interval)
        {
            "weight": "Mục tiêu: 68.0kg -> 67.2kg",
            "Mon": ("Swim: Kỹ thuật", "Khởi động: 100m. Kỹ thuật (drills): 6x50m tập trung lướt nước và sải tay dài. Thả lỏng: 100m. Tổng cự ly: 500m."),
            "Tue": ("Cross-training: Pickleball", "Chơi Pickleball 1-2 tiếng. Giữ nhịp di chuyển linh hoạt, hỗ trợ sự dẻo dai và tim mạch."),
            "Wed": ("Run: Chạy Intervals", "Khởi động: 1.5km. Chạy nhanh (intervals): 6x400m @ pace 4:10/km (Nghỉ đi bộ 90s giữa các hiệp). Thả lỏng: 1.5km. Tập trung guồng chân nhanh."),
            "Thu": ("Cross-training: Pickleball", "Chơi Pickleball 1-2 tiếng. Vận động linh hoạt, phục hồi tích cực."),
            "Fri": ("Thể lực: Cơ trọng tâm & Chân", "Plank 3 hiệp x 1 phút, Squats 3x15, Lunges 3x12, Kiễng gót chân (calf raises) 3x20. Giúp phòng ngừa chấn thương chân."),
            "Sat": ("Run: Chạy dài (Long Run)", "Chạy dài tích lũy 10km @ pace 6:00/km. 1km cuối tăng tốc lên pace 5:00/km."),
            "Sun": ("Swim: Sức bền & Kiểm tra cân nặng", "Bơi bền: 5x100m (nghỉ 30s giữa các hiệp). Tổng cự ly: 500m. Cân lại cân nặng (Mục tiêu: 67.2kg).")
        },
        # WEEK 2 (Even week: Tempo)
        {
            "weight": "Mục tiêu: 67.2kg -> 66.5kg",
            "Mon": ("Swim: Kỹ thuật thở", "Khởi động: 100m. Kỹ thuật (drills): 8x50m tập thở mỗi 3 hoặc 5 sải tay. Thả lỏng: 100m. Tổng cự ly: 600m."),
            "Tue": ("Cross-training: Pickleball", "Chơi Pickleball 1-2 tiếng. Vận động di chuyển năng động."),
            "Wed": ("Run: Chạy Tempo", "Khởi động: 1km. Chạy Tempo: 5km @ pace 4:55/km. Thả lỏng: 1km. Tăng ngưỡng lactate chịu đựng."),
            "Thu": ("Cross-training: Pickleball", "Chơi Pickleball 1-2 tiếng. Tập trung giữ nhịp tim ổn định."),
            "Fri": ("Thể lực: Sức bền cơ bắp", "Plank 3 hiệp x 1 phút, Bulgarian split squats 3x10, Glute bridges (cầu cơ mông) 3x15. Sức mạnh chân đùi."),
            "Sat": ("Run: Chạy dài (Long Run)", "Chạy dài tích lũy 12km @ pace 5:55/km. Tập thở đều. 1km cuối tăng tốc lên pace 4:50/km."),
            "Sun": ("Swim: Sức bền & Kiểm tra cân nặng", "Bơi bền: 3x200m (nghỉ 45s giữa các hiệp). Tổng cự ly: 600m. Cân lại cân nặng (Mục tiêu: 66.5kg).")
        },
        # WEEK 3 (Interval)
        {
            "weight": "Mục tiêu: 66.5kg -> 65.7kg",
            "Mon": ("Swim: Kỹ thuật kéo nước", "Khởi động: 100m. Kỹ thuật (drills): 4x100m tập trung vào pha kéo nước (catch & pull). Thả lỏng: 100m. Tổng cự ly: 600m."),
            "Tue": ("Cross-training: Pickleball", "Chơi Pickleball 1-2 tiếng. Cải thiện phản xạ và sức bền."),
            "Wed": ("Run: Chạy Intervals", "Khởi động: 1.5km. Chạy nhanh (intervals): 5x800m @ pace 4:20/km (Nghỉ đi bộ 2 phút giữa các hiệp). Thả lỏng: 1.5km. Tăng VO2 Max."),
            "Thu": ("Cross-training: Pickleball", "Chơi Pickleball 1-2 tiếng. Bài tập di chuyển hiếu khí tốt."),
            "Fri": ("Thể lực: Core & Thăng bằng", "Plank 3 hiệp x 1 phút, Single-leg deadlifts 3x10, Side planks (plank nghiêng) 3x45s. Ngăn ngừa chấn thương khớp."),
            "Sat": ("Run: Chạy dài (Long Run)", "Chạy dài tích lũy 14km @ pace 5:50/km. Bổ sung điện giải nếu trời nóng. 2km cuối chạy pace 5:00/km."),
            "Sun": ("Swim: Sức bền & Kiểm tra cân nặng", "Bơi bền: 1x300m + 4x100m (nghỉ 30s giữa các hiệp). Tổng cự ly: 700m. Cân lại cân nặng (Mục tiêu: 65.7kg).")
        },
        # WEEK 4 (Recovery & Tempo)
        {
            "weight": "Mục tiêu: 65.7kg -> 65.0kg",
            "Mon": ("Swim: Phục hồi nhẹ nhàng", "Khởi động: 100m. Bơi thả lỏng nhẹ nhàng 300m. Thả lỏng: 100m. Tổng cự ly: 500m."),
            "Tue": ("Cross-training: Pickleball nhẹ", "Chơi Pickleball nhẹ nhàng khoảng 1 tiếng, tránh vận động quá sức."),
            "Wed": ("Run: Chạy Tempo ngắn", "Khởi động: 1.5km. Chạy Tempo ngắn: 3km @ pace 4:45/km. Thả lỏng: 1.5km. Kiểm tra cảm giác cơ thể."),
            "Thu": ("Cross-training: Pickleball nhẹ", "Chơi Pickleball nhẹ nhàng dưỡng sức."),
            "Fri": ("Thể lực: Giãn cơ & Core", "Planks, bird-dogs, dead-bugs. 30 phút rèn cơ bụng và cơ liên sườn."),
            "Sat": ("Run: Chạy đều", "Chạy đều 10km @ pace 5:50/km. Giữ nhịp tim nhẹ nhàng ở Zone 2 phục hồi."),
            "Sun": ("Swim: Bơi bền nhẹ & Kiểm tra cân nặng", "Bơi bền: 2x400m (nghỉ 1 phút giữa các hiệp). Tổng cự ly: 800m. Cân lại cân nặng (Mục tiêu: 65.0kg).")
        },
        # WEEK 5 (Interval)
        {
            "weight": "Mục tiêu: 65.0kg -> 64.2kg",
            "Mon": ("Swim: Cảm giác nước", "Khởi động: 100m. Drills: 6x50m bơi nắm đấm tay (fist-drills) để cảm nhận lực cản nước. Tổng cự ly: 700m."),
            "Tue": ("Cross-training: Pickleball", "Chơi Pickleball 1-2 tiếng. Di chuyển linh hoạt bước nhỏ."),
            "Wed": ("Run: Chạy Intervals", "Khởi động: 2km. Chạy nhanh (intervals): 6x800m @ pace 4:20/km (Nghỉ đi bộ 2 phút). Thả lỏng: 1.5km. Tăng sức bền yếm khí."),
            "Thu": ("Cross-training: Pickleball", "Chơi Pickleball 1-2 tiếng. Giữ nhịp tim ở vùng hiếu khí."),
            "Fri": ("Thể lực: Toàn thân bổ trợ", "Squats, lunges, plank, chống đẩy. 45 phút tập luyện hỗ trợ đầu gối."),
            "Sat": ("Run: Chạy dài (Long Run)", "Chạy dài tích lũy 16km @ pace 5:45/km. 2km cuối tăng tốc lên pace 4:40/km."),
            "Sun": ("Swim: Sức bền & Kiểm tra cân nặng", "Bơi bền: 1x500m + 3x100m (nghỉ 30s giữa các hiệp). Tổng cự ly: 800m. Cân lại cân nặng (Mục tiêu: 64.2kg).")
        },
        # WEEK 6 (Tempo)
        {
            "weight": "Mục tiêu: 64.2kg -> 63.5kg",
            "Mon": ("Swim: Kỹ thuật khuỷu tay", "Khởi động: 100m. Drills: 8x50m bơi khuỷu tay cao (high elbow). Thả lỏng: 100m. Tổng cự ly: 800m."),
            "Tue": ("Cross-training: Pickleball", "Chơi Pickleball 1-2 tiếng. Tăng cường khả năng phản ứng nhanh."),
            "Wed": ("Run: Chạy Tempo", "Khởi động: 1.5km. Chạy Tempo: 6km @ pace 4:40/km. Thả lỏng: 1.5km. Luyện tốc độ đua ổn định."),
            "Thu": ("Cross-training: Pickleball", "Chơi Pickleball 1-2 tiếng. Vận động linh hoạt nhịp tim nhẹ."),
            "Fri": ("Thể lực: Sức mạnh cơ đùi", "Tập lực chân đùi sau và bắp chuối hỗ trợ chạy bền bỉ. Tập luyện 45 phút."),
            "Sat": ("Run: Chạy dài (Long Run)", "Chạy dài tích lũy 18km @ pace 5:45/km. Luyện ý chí. 2km cuối chạy pace 4:35/km."),
            "Sun": ("Swim: Bơi bền & Kiểm tra cân nặng", "Bơi bền: 1x600m + 3x100m. Tổng cự ly: 900m. Cân lại cân nặng (Mục tiêu: 63.5kg).")
        },
        # WEEK 7 (Interval)
        {
            "weight": "Mục tiêu: 63.5kg -> 62.7kg",
            "Mon": ("Swim: Kỹ thuật thở đều", "Khởi động: 100m. Drills: 4x100m thở đều đặn mỗi 3 sải tay. Tổng cự ly: 800m."),
            "Tue": ("Cross-training: Pickleball", "Chơi Pickleball 1-2 tiếng. Vận động cường độ vừa phải."),
            "Wed": ("Run: Chạy Intervals", "Khởi động: 2km. Chạy nhanh (intervals): 5x1000m @ pace 4:15/km (Nghỉ đi bộ 3 phút). Thả lỏng: 1.5km. Bài tập VO2 Max đỉnh cao."),
            "Thu": ("Cross-training: Pickleball", "Chơi Pickleball 1-2 tiếng. Agility và hồi phục nhẹ."),
            "Fri": ("Thể lực: Kháng lực toàn thân", "Chống đẩy, squats, lunges và bài tập core bụng liên sườn. 45 phút."),
            "Sat": ("Run: Chạy dài (Long Run)", "Chạy dài tích lũy 20km @ pace 5:40/km (Mô phỏng cự ly Half Marathon). 2km cuối tăng tốc lên pace 4:30/km."),
            "Sun": ("Swim: Sức bền 1km & Kiểm tra cân nặng", "Bơi bền: 1x800m + 2x100m. Tổng cự ly: 1000m (1km)! Cân lại cân nặng (Mục tiêu: 62.7kg).")
        },
        # WEEK 8 (Taper & Test)
        {
            "weight": "Mục tiêu: 62.7kg -> 62.0kg",
            "Mon": ("Swim: Dưỡng sức thả lỏng", "Khởi động: 100m. Bơi nhẹ nhàng thư giãn 300m. Thả lỏng: 100m. Tổng cự ly: 500m."),
            "Tue": ("Cross-training: Pickleball nhẹ", "Chơi Pickleball rất nhẹ nhàng thư giãn trong 1 tiếng."),
            "Wed": ("Run: Chạy thử tốc độ đua", "Khởi động: 1.5km. Chạy 3km @ pace 4:30/km (Kiểm tra cảm giác pace mục tiêu). Thả lỏng: 1.5km."),
            "Thu": ("Cross-training: Pickleball nhẹ", "Chơi Pickleball rất nhẹ nhàng dưỡng sức."),
            "Fri": ("Nghỉ ngơi hoàn toàn", "Nghỉ ngơi thả lỏng hoàn toàn. Giãn cơ, uống nhiều nước và nạp tinh bột phức tốt."),
            "Sat": ("Run: CHẠY KIỂM TRA HALF MARATHON", "Khởi động kỹ. Chạy kiểm tra 15km @ pace 4:40/km hoặc chạy đủ 21.1km để lập kỷ lục cá nhân!"),
            "Sun": ("Swim: THỬ THÁCH BƠI 1KM LIÊN TỤC & Cân nặng", "Thử thách bơi 1000m (1km) liên tục không nghỉ. Kiểm tra cân nặng cuối cùng (Mục tiêu: 62.0kg).")
        }
    ]
    
    # 1. Generate Markdown content in Vietnamese
    md_content = """# GIÁO ÁN TẬP LUYỆN CÁ NHÂN HÓA 8 TUẦN
**Vận động viên: Phạm Văn Vương Quốc**  
**Mục tiêu 1:** Chạy Half Marathon dưới 1:35 (Pace thi đấu: 4:30/km)  
**Mục tiêu 2:** Bơi liên tục được 1km không nghỉ  
**Mục tiêu 3:** Giảm cân nặng từ 68kg xuống 62kg (giảm 6kg trong 8 tuần)

---

## Đánh giá thể trạng dựa trên lịch sử 3 tháng qua
Từ lịch sử tập luyện trên Strava thực tế của anh:
* **Chạy bộ (Trung bình 24.57 km/tuần, 4.0 buổi/tuần):** Anh có nền tảng hiếu khí tốt và duy trì chạy rất đều đặn. Tuy nhiên cự ly dài nhất mới là 10.72km và pace 10k tốt nhất là 5:34/km. Để đạt pace 4:30/km cho 21.1km, anh cần tăng dần cự ly chạy dài cuối tuần, bổ sung các buổi chạy biến tốc (Intervals) để nâng VO2 Max và chạy Tempo để nâng ngưỡng lactate threshold.
* **Bơi lội (4 buổi trong 3 tháng, max 500m):** Sức bền cơ vai bơi của anh đang ở mức cơ bản. Chúng ta sẽ nâng dần cự ly bơi mỗi ngày từ 500m lên 1000m thông qua 2 buổi bơi mỗi tuần (1 buổi kỹ thuật/thả lỏng, 1 buổi tăng cự ly bền).
* **Hoạt động bổ trợ:** Anh chơi Pickleball rất đều đặn (34 buổi trong 3 tháng) và tập thể lực (30 buổi). Thói quen này đốt nhiều calo, rất tốt cho mục tiêu giảm cân.

---

## Kế hoạch Giảm cân (68kg -> 62kg trong 2 tháng)
* **Mục tiêu tuần:** Giảm trung bình ~0.75kg mỗi tuần.
* **Mức thâm hụt calo cần thiết:** ~825 kcal mỗi ngày.
* **Khuyến nghị Dinh dưỡng:** Nạp khoảng **1,700 - 1,800 kcal** mỗi ngày. Hãy đảm bảo nạp nhiều protein (**110-130g protein/ngày**) để giữ cơ bắp khi tập nặng và giảm mỡ.
* **Calo tiêu thụ từ tập luyện:** Các buổi chạy, bơi và chơi Pickleball sẽ giúp tiêu hao thêm trung bình 400-600 kcal hoạt động mỗi ngày.

---

## Lịch trình tuần tổng quát (Cập nhật mới)
* **Thứ Hai:** Bơi kỹ thuật & Lướt nước
* **Thứ Ba:** Chơi Pickleball (Agility & Sức bền)
* **Thứ Tư:** Chạy bộ (Luân phiên Chạy biến tốc Intervals hoặc Chạy Tempo tốc độ thi đấu)
* **Thứ Năm:** Chơi Pickleball (Agility & Sức bền)
* **Thứ Sáu:** Thể lực Core & Khớp (Ngăn chấn thương)
* **Thứ Bảy:** Chạy dài tăng tiến (Long Run)
* **Chủ Nhật:** Bơi sức bền & Kiểm tra cân nặng tuần

---

## Lịch tập luyện chi tiết 8 tuần
"""
    
    # 2. Generate ICS content
    ics_events = []
    uid_counter = 1
    
    days_of_week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    vn_days_full = {
        "Mon": "Thứ Hai",
        "Tue": "Thứ Ba",
        "Wed": "Thứ Tư",
        "Thu": "Thứ Năm",
        "Fri": "Thứ Sáu",
        "Sat": "Thứ Bảy",
        "Sun": "Chủ Nhật"
    }
    
    for w_idx, week in enumerate(weeks_data):
        w_num = w_idx + 1
        md_content += f"\n### Tuần {w_num} ({week['weight']})\n"
        md_content += "| Thứ | Bài Tập | Chi Tiết | \n|---|---|---|\n"
        
        for d_idx, day_name in enumerate(days_of_week):
            workout_date = start_date + datetime.timedelta(weeks=w_idx, days=d_idx)
            date_str = workout_date.strftime("%Y-%m-%d")
            vn_day = vn_days_full[day_name]
            
            if day_name in week:
                title, desc = week[day_name]
                # Add to markdown
                md_content += f"| {vn_day} ({date_str}) | **{title}** | {desc} |\n"
                
                # Add to ICS
                ics_events.append(get_event_template(
                    uid=f"w{w_num}_{day_name}_{uid_counter}",
                    date_str=date_str,
                    summary=f"Tuần {w_num} - {title}",
                    description=desc
                ))
                uid_counter += 1
            else:
                md_content += f"| {vn_day} ({date_str}) | *Nghỉ ngơi* | Phục hồi tích cực, giãn cơ nhẹ nhàng. |\n"
                
    # Save markdown file
    with open("training_plan.md", "w", encoding="utf-8") as f:
        f.write(md_content)
    print("training_plan.md generated successfully with rescheduled workouts.")
    
    # Save ICS file
    ics_header = """BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Antigravity Sports Expert//Strava Training Plan//VI
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Giao an Tap luyen Strava (Lich moi)
X-WR-TIMEZONE:Asia/Ho_Chi_Minh
"""
    
    ics_footer = "END:VCALENDAR"
    
    with open("strava_training_plan.ics", "w", encoding="utf-8") as f:
        f.write(ics_header)
        for ev in ics_events:
            f.write(ev)
        f.write(ics_footer)
    print("strava_training_plan.ics generated successfully with rescheduled workouts.")

if __name__ == "__main__":
    generate_plan()
