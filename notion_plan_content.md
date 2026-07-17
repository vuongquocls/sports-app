# Kế hoạch Hoàn chỉnh: Nâng cấp Sports App sang Multi-User (1)

🎯
Bản kế hoạch hoàn chỉnh (final). Đăng nhập bằng Strava làm chính, liên kết Google làm dự phòng, đọc cả hoạt động private, onboarding tự backfill 30 ngày rồi sinh giáo án.

### 1. Mục tiêu & phạm vi
Chuyển ứng dụng từ Single-User (cấu hình cứng cho một người, dữ liệu trong LocalStorage + file thô trên VPS) sang Multi-User để nhiều người tự đăng nhập, tự kết nối Strava cá nhân và tự cá nhân hóa giáo án.

### 2. Quyết định nền tảng (đã chốt)
| Hạng mục | Lựa chọn | Lý do |
| :--- | :--- | :--- |
| Đăng nhập chính | Đăng nhập bằng Strava (IdP qua Firebase Custom Token) | Onboarding 1 chạm, mọi user đều đã kết nối Strava |
| Đăng nhập dự phòng | Liên kết Google (khôi phục tài khoản) | Đề phòng mất quyền Strava; Strava thường đã liên kết Google nên thuận tiện |
| Phạm vi Strava (scope) | activity:read_all | Đọc cả hoạt động private |
| Backend | FastAPI (Python) | Tái sử dụng fetch_strava.py hiện có |
| Sync engine | Cloud Functions + Cloud Tasks | Tự scale, retry/backoff sẵn, bớt phụ thuộc VPS |
| Database | Cloud Firestore (NoSQL) | Realtime, Security Rules theo UID, chi phí thấp ban đầu |

### 3. Kiến trúc hệ thống
```
Người dùng (A, B, C...)
        │  1. "Đăng nhập bằng Strava" (OAuth)
        ▼
Frontend (React + Vite / PWA)
        │  2. Gửi code → Backend đổi token + mint Firebase Custom Token
        ▼
Firebase Authentication ──► cấp UID (= strava_athleteId)
        │  (tùy chọn) liên kết Google để khôi phục
        │  3. Gọi API (kèm ID Token)
        ▼
Backend API (FastAPI trên VPS)
        │  4. Đọc/ghi
        ▼
Cloud Firestore  ◄──── 5. Cloud Function Sync Worker (định kỳ + webhook) ──► Strava API
```

### 4. Schema Firestore
```
/users/{UID}
  ├── profile           { displayName, weight, targetWeight, targetPace, createdAt }
  ├── auth_links        { stravaAthleteId, googleLinked: bool, email? }
  ├── schedule/{weekId}    { workouts[], adaptiveState }
  ├── daily_logs/{date}    { sleepScore, weight, completedTasks[] }
  ├── strava_credentials   { accessTokenEnc, refreshTokenEnc, expiresAt, scope, athleteId }
  └── activities/{actId}   { type, distance, movingTime, pace, startDate, rawJson }
```

Ghi chú:
- UID = "strava_" + athleteId, đồng nhất dù đăng nhập qua Strava hay Google đã liên kết.
- Token Strava luôn mã hóa AES-256 trước khi ghi; khóa lưu trong secret manager, không nằm trong DB.

### 5. Firestore Security Rules (viết từ Giai đoạn 0)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == uid;
    }
  }
}
```

Nguyên tắc: User A không bao giờ đọc/ghi được dữ liệu User B. Test bằng 2 tài khoản giả trước khi sang giai đoạn tiếp theo.

### 6. Luồng đăng nhập bằng Strava
1. Người dùng bấm "Đăng nhập bằng Strava".
2. Redirect tới trang ủy quyền (state là nonce ngẫu nhiên chống CSRF):
   `https://www.strava.com/oauth/authorize?client_id=APP_CLIENT_ID&redirect_uri=https://sports-app.com/callback&response_type=code&approval_prompt=auto&scope=activity:read_all&state={RANDOM_NONCE}`
3. Strava redirect về /callback kèm code và state.
4. Backend xác minh state, đổi code lấy access_token + refresh_token và thông tin athlete.
5. Backend dùng athleteId làm định danh, mint Firebase Custom Token (uid = "strava_" + athleteId) trả về frontend để đăng nhập Firebase.
6. Mã hóa token Strava → lưu /users/{UID}/strava_credentials.

#### Liên kết Google dự phòng (tùy chọn)
Sau khi đăng nhập, trong phần cài đặt, người dùng có thể liên kết Google vào cùng tài khoản Firebase (linkWithCredential). Khi Strava bị thu hồi quyền, vẫn đăng nhập được bằng Google để khôi phục và kết nối lại Strava. Vì Strava thường đã liên kết Google, thao tác này gần như liền mạch.

### 7. Onboarding lần đầu (30 ngày → mục tiêu → tạo giáo án)
Ngay sau khi đăng nhập lần đầu:
1. Backend tự động backfill 30 ngày hoạt động gần nhất từ Strava → activities.
2. Người dùng điền mục tiêu (cân nặng hiện tại, cân nặng mục tiêu, pace mục tiêu) → profile.
3. Người dùng bấm "Tạo giáo án" → hệ thống sinh giáo án thích ứng 8 tuần dựa trên dữ liệu 30 ngày + mục tiêu → schedule.

### 8. Sync Worker đa người dùng (có rate-limit)
Strava giới hạn ~100 requests/15 phút và 1000/ngày cho toàn app. Khi nhiều user, phải có hàng đợi.

Cơ chế:
1. Cloud Scheduler kích hoạt định kỳ (15–30 phút).
2. Lấy danh sách user đã kết nối Strava, đẩy từng user thành 1 task vào Cloud Tasks (queue có giới hạn tốc độ).
3. Mỗi task: refresh token → gọi Strava API → ghi vào activities.
4. Áp dụng exponential backoff khi gặp HTTP 429.
5. Ưu tiên dùng Strava Webhook để nhận hoạt động mới theo sự kiện, giảm polling và tiết kiệm quota.

### 9. Migration dữ liệu người dùng đầu tiên
Dữ liệu hiện tại của bạn (LocalStorage + file thô VPS) cần chuyển sang Firestore:
1. Viết script export workoutsDataActive và logs từ LocalStorage → JSON.
2. Parse file Strava thô trên VPS → chuẩn hóa theo schema activities.
3. Import vào /users/{UID_của_bạn}/....
4. Kiểm tra đối chiếu số liệu trước khi tắt luồng cũ.

### 10. Roadmap
| Giai đoạn | Công việc chính | Thời gian | Điều kiện hoàn thành (Gate) |
| :--- | :--- | :--- | :--- |
| GĐ 0 | Chốt công nghệ, thiết kế schema, viết + test Security Rules với 2 tài khoản giả | 2 ngày | Rules chặn được truy cập chéo |
| GĐ 1 | Khởi tạo React+Vite, Firebase Auth & Firestore | 3–4 ngày | Khởi tạo thành công, kết nối Firestore |
| GĐ 2 | Đăng nhập bằng Strava (Custom Token) + liên kết Google dự phòng | 3–4 ngày | Đăng nhập Strava & Google đều cấp đúng UID |
| GĐ 3 | Onboarding: backfill 30 ngày + nhập mục tiêu + tạo giáo án | 3 ngày | Sinh giáo án 8 tuần từ dữ liệu thực |
| GĐ 4 | Sync Worker (Cloud Functions + Cloud Tasks) + backoff + webhook | 3–4 ngày | Đồng bộ nhiều user không vượt quota |
| GĐ 5 | Migrate dữ liệu người dùng đầu tiên | 1–2 ngày | Số liệu khớp bản cũ |
| GĐ 6 | Hoàn thiện giao diện React, đọc dữ liệu động từ Firestore | 4–6 ngày | UI hiển thị đúng theo user |
| GĐ 7 | Kiểm thử bảo mật (pen-test cơ bản) & phát hành | 2–3 ngày | Không rò rỉ dữ liệu chéo |

Tổng thời gian dự kiến: ~21–29 ngày công.

### 11. Checklist bảo mật trước khi phát hành
- [ ] Security Rules chặn truy cập chéo (test 2 tài khoản).
- [ ] Token Strava mã hóa AES-256, khóa nằm trong secret manager.
- [ ] state nonce chống CSRF trong OAuth.
- [ ] Refresh token hết hạn được xử lý (tự refresh, báo lỗi khi user thu hồi quyền).
- [ ] Rate-limit & backoff cho Strava sync.
- [ ] Xác minh chữ ký webhook Strava (verify token).
- [ ] Liên kết Google hoạt động đúng (khôi phục được khi mất Strava).
