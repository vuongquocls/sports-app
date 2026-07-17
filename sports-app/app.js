// START DATE of the training plan: 2026-07-20 (Monday)
const PLAN_START_DATE = new Date("2026-07-20T00:00:00");

const workoutsData = [
  // WEEK 1
  {
    target: "68.0kg -> 67.2kg",
    days: {
      Mon: { type: "Swim", title: "Swim: Kỹ thuật", desc: "Khởi động: 100m. Kỹ thuật (drills): 6x50m tập trung lướt nước và sải tay dài. Thả lỏng: 100m. Tổng cự ly: 500m." },
      Tue: { type: "Pickleball", title: "Cross-training: Pickleball", desc: "Chơi Pickleball 1-2 tiếng. Giữ nhịp di chuyển linh hoạt, hỗ trợ sự dẻo dai và tim mạch." },
      Wed: { type: "Run", title: "Run: Chạy Intervals", desc: "Khởi động: 1.5km. Chạy nhanh (intervals): 6x400m @ pace 4:10/km (Nghỉ đi bộ 90s giữa các hiệp). Thả lỏng: 1.5km. Tập trung guồng chân nhanh." },
      Thu: { type: "Pickleball", title: "Cross-training: Pickleball", desc: "Chơi Pickleball 1-2 tiếng. Vận động linh hoạt, phục hồi tích cực." },
      Fri: { type: "Workout", title: "Thể lực: Cơ trọng tâm & Chân", desc: "Plank 3 hiệp x 1 phút, Squats 3x15, Lunges 3x12, Kiễng gót chân (calf raises) 3x20. Giúp phòng ngừa chấn thương chân." },
      Sat: { type: "Run", title: "Run: Chạy dài (Long Run)", desc: "Chạy dài tích lũy 10km @ pace 6:00/km. 1km cuối tăng tốc lên pace 5:00/km." },
      Sun: { type: "Swim", title: "Swim: Sức bền & Kiểm tra cân nặng", desc: "Bơi bền: 5x100m (nghỉ 30s giữa các hiệp). Tổng cự ly: 500m. Cân lại cân nặng (Mục tiêu: 67.2kg)." }
    }
  },
  // WEEK 2
  {
    target: "67.2kg -> 66.5kg",
    days: {
      Mon: { type: "Swim", title: "Swim: Kỹ thuật thở", desc: "Khởi động: 100m. Kỹ thuật (drills): 8x50m tập thở mỗi 3 hoặc 5 sải tay. Thả lỏng: 100m. Tổng cự ly: 600m." },
      Tue: { type: "Pickleball", title: "Cross-training: Pickleball", desc: "Chơi Pickleball 1-2 tiếng. Vận động di chuyển năng động." },
      Wed: { type: "Run", title: "Run: Chạy Tempo", desc: "Khởi động: 1km. Chạy Tempo: 5km @ pace 4:55/km. Thả lỏng: 1km. Tăng ngưỡng lactate chịu đựng." },
      Thu: { type: "Pickleball", title: "Cross-training: Pickleball", desc: "Chơi Pickleball 1-2 tiếng. Tập trung giữ nhịp tim ở vùng hiếu khí." },
      Fri: { type: "Workout", title: "Thể lực: Sức bền cơ bắp", desc: "Plank 3 hiệp x 1 phút, Bulgarian split squats 3x10, Glute bridges (cầu cơ mông) 3x15. Sức mạnh chân đùi." },
      Sat: { type: "Run", title: "Run: Chạy dài (Long Run)", desc: "Chạy dài tích lũy 12km @ pace 5:55/km. Tập thở đều. 1km cuối tăng tốc lên pace 4:50/km." },
      Sun: { type: "Swim", title: "Swim: Sức bền & Kiểm tra cân nặng", desc: "Bơi bền: 3x200m (nghỉ 45s giữa các hiệp). Tổng cự ly: 600m. Cân lại cân nặng (Mục tiêu: 66.5kg)." }
    }
  },
  // WEEK 3
  {
    target: "66.5kg -> 65.7kg",
    days: {
      Mon: { type: "Swim", title: "Swim: Kỹ thuật kéo nước", desc: "Khởi động: 100m. Kỹ thuật (drills): 4x100m tập trung vào pha kéo nước (catch & pull). Thả lỏng: 100m. Tổng cự ly: 600m." },
      Tue: { type: "Pickleball", title: "Cross-training: Pickleball", desc: "Chơi Pickleball 1-2 tiếng. Cải thiện phản xạ và sức bền." },
      Wed: { type: "Run", title: "Run: Chạy Intervals", desc: "Khởi động: 1.5km. Chạy nhanh (intervals): 5x800m @ pace 4:20/km (Nghỉ đi bộ 2 phút giữa các hiệp). Thả lỏng: 1.5km. Tăng VO2 Max." },
      Thu: { type: "Pickleball", title: "Cross-training: Pickleball", desc: "Chơi Pickleball 1-2 tiếng. Bài tập di chuyển hiếu khí tốt." },
      Fri: { type: "Workout", title: "Thể lực: Core & Thăng bằng", desc: "Plank 3 hiệp x 1 phút, Single-leg deadlifts 3x10, Side planks (plank nghiêng) 3x45s. Ngăn ngừa chấn thương khớp." },
      Sat: { type: "Run", title: "Run: Chạy dài (Long Run)", desc: "Chạy dài tích lũy 14km @ pace 5:50/km. Bổ sung điện giải nếu trời nóng. 2km cuối chạy pace 5:00/km." },
      Sun: { type: "Swim", title: "Swim: Sức bền & Kiểm tra cân nặng", desc: "Bơi bền: 1x300m + 4x100m (nghỉ 30s giữa các hiệp). Tổng cự ly: 700m. Cân lại cân nặng (Mục tiêu: 65.7kg)." }
    }
  },
  // WEEK 4
  {
    target: "65.7kg -> 65.0kg",
    days: {
      Mon: { type: "Swim", title: "Swim: Phục hồi nhẹ nhàng", desc: "Khởi động: 100m. Bơi thả lỏng nhẹ nhàng 300m. Thả lỏng: 100m. Tổng cự ly: 500m." },
      Tue: { type: "Pickleball", title: "Cross-training: Pickleball nhẹ", desc: "Chơi Pickleball nhẹ nhàng khoảng 1 tiếng, tránh vận động quá sức." },
      Wed: { type: "Run", title: "Run: Chạy Tempo ngắn", desc: "Khởi động: 1.5km. Chạy Tempo ngắn: 3km @ pace 4:45/km. Thả lỏng: 1.5km. Kiểm tra cảm giác cơ thể." },
      Thu: { type: "Pickleball", title: "Cross-training: Pickleball nhẹ", desc: "Chơi Pickleball nhẹ nhàng dưỡng sức." },
      Fri: { type: "Workout", title: "Thể lực: Giãn cơ & Core", desc: "Planks, bird-dogs, dead-bugs. 30 phút rèn cơ bụng và cơ liên sườn." },
      Sat: { type: "Run", title: "Run: Chạy đều", desc: "Chạy đều 10km @ pace 5:50/km. Giữ nhịp tim nhẹ nhàng ở Zone 2 phục hồi." },
      Sun: { type: "Swim", title: "Swim: Bơi bền nhẹ & Kiểm tra cân nặng", desc: "Bơi bền: 2x400m (nghỉ 1 phút giữa các hiệp). Tổng cự ly: 800m. Cân lại cân nặng (Mục tiêu: 65.0kg)." }
    }
  },
  // WEEK 5
  {
    target: "65.0kg -> 64.2kg",
    days: {
      Mon: { type: "Swim", title: "Swim: Cảm giác nước", desc: "Khởi động: 100m. Drills: 6x50m bơi nắm đấm tay (fist-drills) để cảm nhận lực cản nước. Tổng cự ly: 700m." },
      Tue: { type: "Pickleball", title: "Cross-training: Pickleball", desc: "Chơi Pickleball 1-2 tiếng. Di chuyển linh hoạt bước nhỏ." },
      Wed: { type: "Run", title: "Run: Chạy Intervals", desc: "Khởi động: 2km. Chạy nhanh (intervals): 6x800m @ pace 4:20/km (Nghỉ đi bộ 2 phút). Thả lỏng: 1.5km. Tăng sức bền yếm khí." },
      Thu: { type: "Pickleball", title: "Cross-training: Pickleball", desc: "Chơi Pickleball 1-2 tiếng. Giữ nhịp tim ở vùng hiếu khí." },
      Fri: { type: "Workout", title: "Thể lực: Toàn thân bổ trợ", desc: "Squats, lunges, plank, chống đẩy. 45 phút tập luyện hỗ trợ đầu gối." },
      Sat: { type: "Run", title: "Run: Chạy dài (Long Run)", desc: "Chạy dài tích lũy 16km @ pace 5:45/km. 2km cuối tăng tốc lên pace 4:40/km." },
      Sun: { type: "Swim", title: "Swim: Sức bền & Kiểm tra cân nặng", desc: "Bơi bền: 1x500m + 3x100m (nghỉ 30s giữa các hiệp). Tổng cự ly: 800m. Cân lại cân nặng (Mục tiêu: 64.2kg)." }
    }
  },
  // WEEK 6
  {
    target: "64.2kg -> 63.5kg",
    days: {
      Mon: { type: "Swim", title: "Swim: Kỹ thuật khuỷu tay", desc: "Khởi động: 100m. Drills: 8x50m bơi khuỷu tay cao (high elbow). Thả lỏng: 100m. Tổng cự ly: 800m." },
      Tue: { type: "Pickleball", title: "Cross-training: Pickleball", desc: "Chơi Pickleball 1-2 tiếng. Tăng cường khả năng phản ứng nhanh." },
      Wed: { type: "Run", title: "Run: Chạy Tempo", desc: "Khởi động: 1.5km. Chạy Tempo: 6km @ pace 4:40/km. Thả lỏng: 1.5km. Luyện tốc độ đua ổn định." },
      Thu: { type: "Pickleball", title: "Cross-training: Pickleball", desc: "Chơi Pickleball 1-2 tiếng. Vận động linh hoạt nhịp tim nhẹ." },
      Fri: { type: "Workout", title: "Thể lực: Sức mạnh cơ đùi", desc: "Tập lực chân đùi sau và bắp chuối hỗ trợ chạy bền bỉ. Tập luyện 45 phút." },
      Sat: { type: "Run", title: "Run: Chạy dài (Long Run)", desc: "Chạy dài tích lũy 18km @ pace 5:45/km. Luyện ý chí. 2km cuối chạy pace 4:35/km." },
      Sun: { type: "Swim", title: "Swim: Bơi bền & Kiểm tra cân nặng", desc: "Bơi bền: 1x600m + 3x100m. Tổng cự ly: 900m. Cân lại cân nặng (Mục tiêu: 63.5kg)." }
    }
  },
  // WEEK 7
  {
    target: "63.5kg -> 62.7kg",
    days: {
      Mon: { type: "Swim", title: "Swim: Kỹ thuật thở đều", desc: "Khởi động: 100m. Drills: 4x100m thở đều đặn mỗi 3 sải tay. Tổng cự ly: 800m." },
      Tue: { type: "Pickleball", title: "Cross-training: Pickleball", desc: "Chơi Pickleball 1-2 tiếng. Vận động cường độ vừa phải." },
      Wed: { type: "Run", title: "Run: Chạy Intervals", desc: "Khởi động: 2km. Chạy nhanh (intervals): 5x1000m @ pace 4:15/km (Nghỉ đi bộ 3 phút). Thả lỏng: 1.5km. Bài tập VO2 Max đỉnh cao." },
      Thu: { type: "Pickleball", title: "Cross-training: Pickleball", desc: "Chơi Pickleball 1-2 tiếng. Agility và hồi phục nhẹ." },
      Fri: { type: "Workout", title: "Thể lực: Kháng lực toàn thân", desc: "Chống đẩy, squats, lunges và bài tập core bụng liên sườn. 45 phút." },
      Sat: { type: "Run", title: "Run: Chạy dài (Long Run)", desc: "Chạy dài tích lũy 20km @ pace 5:40/km. 2km cuối tăng tốc lên pace 4:30/km." },
      Sun: { type: "Swim", title: "Swim: Sức bền 1km & Kiểm tra cân nặng", desc: "Bơi bền: 1x800m + 2x100m. Tổng cự ly: 1000m (1km)! Cân lại cân nặng (Mục tiêu: 62.7kg)." }
    }
  },
  // WEEK 8
  {
    target: "62.7kg -> 62.0kg",
    days: {
      Mon: { type: "Swim", title: "Swim: Dưỡng sức thả lỏng", desc: "Khởi động: 100m. Bơi nhẹ nhàng thư giãn 300m. Thả lỏng: 100m. Tổng cự ly: 500m." },
      Tue: { type: "Pickleball", title: "Cross-training: Pickleball nhẹ", desc: "Chơi Pickleball rất nhẹ nhàng thư giãn trong 1 tiếng." },
      Wed: { type: "Run", title: "Run: Chạy thử tốc độ đua", desc: "Khởi động: 1.5km. Chạy 3km @ pace 4:30/km (Kiểm tra cảm giác pace mục tiêu). Thả lỏng: 1.5km." },
      Thu: { type: "Pickleball", title: "Cross-training: Pickleball nhẹ", desc: "Chơi Pickleball rất nhẹ nhàng dưỡng sức." },
      Fri: { type: "Workout", title: "Nghỉ ngơi hoàn toàn", desc: "Nghỉ ngơi thả lỏng hoàn toàn. Giãn cơ, uống nhiều nước và nạp tinh bột phức tốt." },
      Sat: { type: "Run", title: "Run: CHẠY KIỂM TRA HALF MARATHON", desc: "Khởi động kỹ. Chạy kiểm tra 15km @ pace 4:40/km hoặc chạy đủ 21.1km để lập kỷ lục cá nhân!" },
      Sun: { type: "Swim", title: "Swim: THỬ THÁCH BƠI 1KM LIÊN TỤC & Cân nặng", desc: "Thử thách bơi 1000m (1km) liên tục không nghỉ. Kiểm tra cân nặng cuối cùng (Mục tiêu: 62.0kg)." }
    }
  }
];

const dayNamesMap = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat"
};

const vnDayNames = {
  "Mon": "Thứ Hai",
  "Tue": "Thứ Ba",
  "Wed": "Thứ Tư",
  "Thu": "Thứ Năm",
  "Fri": "Thứ Sáu",
  "Sat": "Thứ Bảy",
  "Sun": "Chủ Nhật"
};

// State variables
let currentTab = 'today';
let completedWorkouts = JSON.parse(localStorage.getItem('completed_workouts') || '{}');
let sleepScores = JSON.parse(localStorage.getItem('sleep_scores') || '{}');
let workoutsDataActive = JSON.parse(localStorage.getItem('adapted_workouts'));
if (!workoutsDataActive) {
  workoutsDataActive = JSON.parse(JSON.stringify(workoutsData));
}

// Determine current week and day relative to start date
function getTrainingDayInfo(testDate = new Date()) {
  const diffTime = testDate - PLAN_START_DATE;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    // Before training plan starts
    return { status: 'pre_start', diffDays };
  }
  
  const weekIdx = Math.floor(diffDays / 7);
  const dayIdx = diffDays % 7;
  const daysKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayKey = daysKeys[dayIdx];
  
  if (weekIdx >= workoutsDataActive.length) {
    // Finished the plan
    return { status: 'finished' };
  }
  
  return {
    status: 'active',
    weekNum: weekIdx + 1,
    weekIdx: weekIdx,
    dayKey: dayKey,
    dateString: testDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })
  };
}

// Switch navigation tabs
function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  document.getElementById(`tab-${tabId}`).classList.add('active');
  // find nav button
  const buttons = document.querySelectorAll('.nav-item');
  if (tabId === 'today') buttons[0].classList.add('active');
  if (tabId === 'schedule') buttons[1].classList.add('active');
  if (tabId === 'stats') buttons[2].classList.add('active');
  if (tabId === 'strava') buttons[3].classList.add('active');
  
  currentTab = tabId;
  
  if (tabId === 'stats') {
    drawWeightChart();
  }
}

// Render schedule tab
function renderSchedule() {
  const container = document.getElementById('schedule-container');
  container.innerHTML = '';
  
  workoutsDataActive.forEach((week, wIdx) => {
    const weekDiv = document.createElement('div');
    weekDiv.style.marginBottom = '16px';
    
    const header = document.createElement('div');
    header.className = 'week-header';
    header.innerHTML = `
      <span>Tuần ${wIdx + 1}</span>
      <span class="week-target-text">Mục tiêu cân nặng: ${week.target}</span>
    `;
    
    const daysDiv = document.createElement('div');
    daysDiv.className = 'week-days';
    
    // Add individual days
    const dayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    dayKeys.forEach(day => {
      const workout = week.days[day];
      const vnDay = vnDayNames[day];
      const workoutId = `w${wIdx + 1}_${day}`;
      const isCompleted = completedWorkouts[workoutId] ? 'checked' : '';
      
      const badgeClass = `badge badge-${workout.type.toLowerCase()}`;
      
      const dayRow = document.createElement('div');
      dayRow.className = 'day-row';
      dayRow.innerHTML = `
        <div class="day-label">${vnDay}</div>
        <div class="day-info">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="day-title">${workout.title}</span>
            <span class="${badgeClass}">${workout.type === 'Run' ? 'Chạy bộ' : workout.type === 'Swim' ? 'Bơi lội' : workout.type === 'Workout' ? 'Cơ lực' : workout.type === 'Rest' ? 'Nghỉ ngơi' : workout.type}</span>
            <button class="edit-btn-inline" onclick="event.stopPropagation(); openAdjustModal(${wIdx}, '${day}')">Sửa</button>
          </div>
          <div class="day-desc">${workout.desc}</div>
        </div>
        <label class="checkbox-container">
          <input type="checkbox" id="chk-${workoutId}" ${isCompleted} onchange="toggleWorkoutStatus('${workoutId}')">
          <span class="checkmark"></span>
        </label>
      `;
      daysDiv.appendChild(dayRow);
    });
    
    weekDiv.appendChild(header);
    weekDiv.appendChild(daysDiv);
    container.appendChild(weekDiv);
  });
}

// Toggle workout completion
function toggleWorkoutStatus(workoutId) {
  const checkbox = document.getElementById(`chk-${workoutId}`);
  if (checkbox) {
    if (checkbox.checked) {
      completedWorkouts[workoutId] = true;
    } else {
      delete completedWorkouts[workoutId];
    }
    localStorage.setItem('completed_workouts', JSON.stringify(completedWorkouts));
    updateTodayTab();
  }
}

// Toggle current day workout
function toggleTodayWorkout() {
  const info = getTrainingDayInfo();
  if (info.status === 'active') {
    const workoutId = `w${info.weekNum}_${info.dayKey}`;
    const isCompleted = completedWorkouts[workoutId];
    
    if (isCompleted) {
      delete completedWorkouts[workoutId];
    } else {
      completedWorkouts[workoutId] = true;
    }
    
    localStorage.setItem('completed_workouts', JSON.stringify(completedWorkouts));
    
    // Sync checklist if drawn
    const chk = document.getElementById(`chk-${workoutId}`);
    if (chk) chk.checked = !isCompleted;
    
    updateTodayTab();
  }
}

// Update Today tab values
function updateTodayTab() {
  const info = getTrainingDayInfo();
  const dateEl = document.getElementById('current-date');
  const targetWeightEl = document.getElementById('today-weight-target');
  const workoutCard = document.getElementById('today-workout-card');
  const workoutName = document.getElementById('today-workout-name');
  const workoutDesc = document.getElementById('today-workout-desc');
  const workoutBadge = document.getElementById('today-badge');
  const completeBtn = document.getElementById('btn-complete-today');
  
  if (info.status === 'pre_start') {
    dateEl.innerText = "Chưa đến thời gian tập";
    targetWeightEl.innerText = "Bắt đầu: 68.0 kg";
    workoutName.innerText = "Chào mừng anh Vương Quốc!";
    workoutDesc.innerText = "Giáo án luyện tập chính thức sẽ bắt đầu vào Thứ Hai, ngày 20/07/2026. Anh hãy nghỉ ngơi và ăn uống khoa học để chuẩn bị sẵn sàng!";
    workoutBadge.innerText = "Welcome";
    workoutBadge.className = "badge badge-rest";
    completeBtn.style.display = "none";
  } else if (info.status === 'finished') {
    dateEl.innerText = "Hoàn thành 8 tuần!";
    targetWeightEl.innerText = "Mục tiêu cuối: 62.0 kg";
    workoutName.innerText = "Chúc mừng anh!";
    workoutDesc.innerText = "Anh đã hoàn thành trọn vẹn 8 tuần tập luyện. Chúc anh đạt thành tích kỷ lục Half Marathon 1:35 và bơi 1km thành công!";
    workoutBadge.innerText = "Finish";
    workoutBadge.className = "badge badge-run";
    completeBtn.style.display = "none";
  } else {
    // Active training day
    const week = workoutsDataActive[info.weekIdx];
    const workout = week.days[info.dayKey];
    const workoutId = `w${info.weekNum}_${info.dayKey}`;
    const isCompleted = completedWorkouts[workoutId];
    
    dateEl.innerText = `Tuần ${info.weekNum} - ${vnDayNames[info.dayKey]}`;
    targetWeightEl.innerText = `Cân nặng: ${week.target.split(" -> ")[1]}`;
    workoutName.innerText = workout.title;
    workoutDesc.innerText = workout.desc;
    
    workoutBadge.innerText = workout.type === 'Run' ? 'Chạy bộ' : workout.type === 'Swim' ? 'Bơi lội' : workout.type === 'Workout' ? 'Cơ lực' : workout.type === 'Rest' ? 'Nghỉ ngơi' : workout.type;
    workoutBadge.className = `badge badge-${workout.type.toLowerCase()}`;
    
    completeBtn.style.display = "block";
    if (isCompleted) {
      completeBtn.innerText = "Đã Hoàn Thành ✓";
      completeBtn.className = "btn-complete done";
    } else {
      completeBtn.innerText = "Đánh dấu Hoàn thành";
      completeBtn.className = "btn-complete";
    }
  }
}

// Draw the dynamic SVG weight line chart
function drawWeightChart() {
  const svg = document.getElementById('weight-chart');
  const linePath = document.getElementById('weight-line-path');
  const areaPath = document.getElementById('weight-area-path');
  const dotsGroup = document.getElementById('weight-dots-group');
  
  // Weight points for 8 weeks + starting weight
  // 68.0 -> 67.2 -> 66.5 -> 65.7 -> 65.0 -> 64.2 -> 63.5 -> 62.7 -> 62.0
  const weights = [68.0, 67.2, 66.5, 65.7, 65.0, 64.2, 63.5, 62.7, 62.0];
  const maxWeight = 68.0;
  const minWeight = 61.5;
  const height = 100; // SVG height padding
  const width = 480;
  
  // Map values to coordinates
  const points = weights.map((w, idx) => {
    const x = 10 + (idx * (width / 8));
    // w = 68 -> y = 20 (high), w = 62 -> y = 100 (low)
    const ratio = (maxWeight - w) / (maxWeight - minWeight);
    const y = 20 + ratio * (height - 30);
    return { x, y, val: w };
  });
  
  // Create line path d-string
  const dLine = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  linePath.setAttribute('d', dLine);
  
  // Create area path d-string
  const dArea = `${dLine} L ${points[points.length - 1].x} 110 L ${points[0].x} 110 Z`;
  areaPath.setAttribute('d', dArea);
  
  // Render dots
  dotsGroup.innerHTML = '';
  points.forEach((p, idx) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', p.x);
    circle.setAttribute('cy', p.y);
    circle.setAttribute('r', 4);
    circle.setAttribute('class', 'weight-dot');
    
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `Tuần ${idx}: ${p.val}kg`;
    circle.appendChild(title);
    
    // Text label for weight value
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', p.x);
    text.setAttribute('y', p.y - 8);
    text.setAttribute('fill', '#a0a5b5');
    text.setAttribute('font-size', '9px');
    text.setAttribute('text-anchor', 'middle');
    text.textContent = `${p.val}k`;
    
    dotsGroup.appendChild(circle);
    dotsGroup.appendChild(text);
  });
}

// Fetch actual Strava activity data from JSON file
async function loadStravaActivities() {
  try {
    const response = await fetch('strava_activities_3m.json?t=' + new Date().getTime());
    if (!response.ok) {
      console.warn("Strava activities file not found or server issues.");
      return;
    }
    const activities = await response.json();
    displayStravaActivities(activities);
  } catch (err) {
    console.error("Error loading Strava activities:", err);
  }
}

// Display Strava activities in DOM
function displayStravaActivities(activities) {
  // Sort activities from newest to oldest
  activities.sort((a, b) => new Date(b.start_date_local || b.start_date) - new Date(a.start_date_local || a.start_date));
  const listEl = document.getElementById('strava-activities-list');
  const runDistEl = document.getElementById('strava-run-dist');
  const runPaceEl = document.getElementById('strava-run-pace');
  
  listEl.innerHTML = '';
  
  let runs = activities.filter(a => (a.sport_type || a.type) === 'Run');
  let swims = activities.filter(a => (a.sport_type || a.type) === 'Swim');
  let pickleballs = activities.filter(a => (a.sport_type || a.type) === 'Pickleball');
  let workouts = activities.filter(a => (a.sport_type || a.type) === 'Workout');
  
  // Format total distance
  let totalRunM = runs.reduce((sum, r) => sum + r.distance, 0);
  let totalRunKm = totalRunM / 1000.0;
  runDistEl.innerText = `${totalRunKm.toFixed(1)} km`;
  
  // Format overall pace
  let totalTimeS = runs.reduce((sum, r) => sum + r.moving_time, 0);
  if (totalTimeS > 0) {
    let speed = totalRunM / totalTimeS;
    let minPerKm = 1000.0 / (speed * 60.0);
    let mins = Math.floor(minPerKm);
    let secs = Math.floor((minPerKm - mins) * 60);
    runPaceEl.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs} /km`;
  }
  
  // Limit to latest 10 activities
  const latestActivities = activities.slice(0, 10);
  
  latestActivities.forEach(act => {
    const sport = act.sport_type || act.type;
    const isSwim = sport === 'Swim';
    const isPickle = sport === 'Pickleball';
    const isWorkout = sport === 'Workout';
    
    let cardClass = 'strava-activity-card';
    if (isSwim) cardClass += ' strava-activity-swim';
    if (isPickle) cardClass += ' strava-activity-pickle';
    if (isWorkout) cardClass += ' strava-activity-workout';
    
    // Formatting values
    const date = new Date(act.start_date_local).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    let mainMetric = '';
    let subMetric = '';
    
    if (sport === 'Run') {
      mainMetric = `${(act.distance / 1000).toFixed(2)} km`;
      // Pace
      let speed = act.distance / act.moving_time;
      let minPerKm = 1000.0 / (speed * 60.0);
      let mins = Math.floor(minPerKm);
      let secs = Math.floor((minPerKm - mins) * 60);
      subMetric = `${mins}:${secs < 10 ? '0' : ''}${secs}/km`;
    } else if (sport === 'Swim') {
      mainMetric = `${act.distance.toFixed(0)} m`;
      subMetric = `${Math.floor(act.moving_time / 60)} phút`;
    } else {
      mainMetric = sport;
      subMetric = `${Math.floor(act.moving_time / 60)} phút`;
    }
    
    const card = document.createElement('a');
    card.href = `https://www.strava.com/activities/${act.id}`;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = cardClass;
    card.style.textDecoration = 'none';
    card.style.color = 'inherit';
    card.innerHTML = `
      <div class="strava-act-info">
        <h4>${act.name}</h4>
        <p>${date} • ${sport === 'Run' ? 'Chạy bộ' : sport === 'Swim' ? 'Bơi lội' : sport}</p>
      </div>
      <div class="strava-act-metrics">
        <div class="strava-act-main-metric">${mainMetric}</div>
        <div class="strava-act-sub-metric">${subMetric}</div>
      </div>
    `;
    listEl.appendChild(card);
  });
}

// Initial page setup
window.addEventListener('DOMContentLoaded', () => {
  renderSchedule();
  updateTodayTab();
  loadStravaActivities();
  updateAdaptabilityStatus();
  updateSleepScoreInputForToday();
  
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.error('Service Worker Registry Failed', err));
  }
});

// --- SLEEP & ADAPTATION FUNCTIONS ---

function updateSleepScoreLabel(val) {
  const label = document.getElementById('sleep-score-label');
  let rating = "Kém";
  if (val >= 90) rating = "Xuất sắc";
  else if (val >= 70) rating = "Tốt";
  else if (val >= 50) rating = "Trung bình";
  
  if (label) {
    label.innerText = `${val} điểm (${rating})`;
  }
}

function saveSleepScore() {
  const scoreInput = document.getElementById('sleep-score-input');
  if (!scoreInput) return;
  const score = parseInt(scoreInput.value);
  
  const today = new Date();
  const yr = today.getFullYear();
  const mo = String(today.getMonth() + 1).padStart(2, '0');
  const dy = String(today.getDate()).padStart(2, '0');
  const dateKey = `${yr}-${mo}-${dy}`;
  
  sleepScores[dateKey] = score;
  localStorage.setItem('sleep_scores', JSON.stringify(sleepScores));
  
  // Visual feedback
  const btn = document.getElementById('btn-save-sleep');
  if (btn) {
    const oldText = btn.innerText;
    btn.innerText = "Đã Lưu ✓";
    btn.style.borderColor = "var(--accent-run)";
    btn.style.color = "var(--accent-run)";
    
    setTimeout(() => {
      btn.innerText = oldText;
      btn.style.borderColor = "var(--accent-swim)";
      btn.style.color = "var(--accent-swim)";
    }, 2000);
  }
  
  updateAdaptabilityStatus();
}

function updateSleepScoreInputForToday() {
  const today = new Date();
  const yr = today.getFullYear();
  const mo = String(today.getMonth() + 1).padStart(2, '0');
  const dy = String(today.getDate()).padStart(2, '0');
  const dateKey = `${yr}-${mo}-${dy}`;
  
  const savedScore = sleepScores[dateKey];
  const input = document.getElementById('sleep-score-input');
  if (input) {
    if (savedScore !== undefined) {
      input.value = savedScore;
      updateSleepScoreLabel(savedScore);
    } else {
      input.value = 75;
      updateSleepScoreLabel(75);
    }
  }
}

function getDatesOfWeek(wIdx) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(PLAN_START_DATE);
    d.setDate(d.getDate() + wIdx * 7 + i);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    dates.push(`${yr}-${mo}-${dy}`);
  }
  return dates;
}

function updateAdaptabilityStatus() {
  const info = getTrainingDayInfo();
  let targetWeekIdx = 0;
  
  if (info.status === 'active') {
    targetWeekIdx = info.weekIdx;
  } else if (info.status === 'finished') {
    targetWeekIdx = 7;
  }
  
  const wNum = targetWeekIdx + 1;
  const dayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Calculate completion rate
  let checkedCount = 0;
  dayKeys.forEach(day => {
    if (completedWorkouts[`w${wNum}_${day}`]) {
      checkedCount++;
    }
  });
  const completionRate = (checkedCount / 7) * 100;
  
  // Calculate average sleep score
  const dates = getDatesOfWeek(targetWeekIdx);
  let sleepSum = 0;
  let sleepCount = 0;
  dates.forEach(date => {
    if (sleepScores[date] !== undefined) {
      sleepSum += sleepScores[date];
      sleepCount++;
    }
  });
  const avgSleep = sleepCount > 0 ? Math.round(sleepSum / sleepCount) : null;
  
  const statusEl = document.getElementById('adapt-status');
  if (statusEl) {
    let statusHtml = `<strong>Chỉ số Tuần ${wNum} Hiện tại:</strong><br>`;
    statusHtml += `• Tỉ lệ hoàn thành bài: <strong>${checkedCount}/7 bài (${completionRate.toFixed(0)}%)</strong><br>`;
    statusHtml += `• Giấc ngủ trung bình: <strong>${avgSleep !== null ? avgSleep + ' / 100đ' : 'Chưa có ghi nhận'}</strong><br><br>`;
    
    // Add custom advice
    if (completionRate < 60 || (avgSleep !== null && avgSleep < 65)) {
      statusHtml += `<span style="color: var(--accent-strength);">⚠️ Khuyến nghị: Anh đang tích lũy mệt mỏi hoặc thiếu ngủ. Nên bấm nút dưới để <strong>giảm tải giáo án Tuần sau</strong> (giảm cự ly chạy dài/bơi, làm chậm pace mục tiêu) nhằm tránh chấn thương.</span>`;
    } else if (completionRate >= 80 && (avgSleep === null || avgSleep >= 75)) {
      statusHtml += `<span style="color: var(--accent-run);">🚀 Khuyến nghị: Thể trạng xuất sắc! Cân nặng tốt, giấc ngủ tốt. Hãy tiếp tục bám sát giáo án gốc để tối ưu hiệu quả.</span>`;
    } else {
      statusHtml += `<span style="color: var(--accent-pickle);">✓ Khuyến nghị: Thể trạng trung bình ổn định. Tiếp tục giáo án tuần sau như lịch trình cũ.</span>`;
    }
    
    statusEl.innerHTML = statusHtml;
  }
}

function adaptWorkoutText(desc) {
  let newDesc = desc;
  
  // 1. Slow down pace targets by 10s: e.g. "pace 4:10/km" -> "pace 4:20/km"
  newDesc = newDesc.replace(/pace (\d+):(\d+)\/km/g, (match, p1, p2) => {
    let mins = parseInt(p1);
    let secs = parseInt(p2) + 10;
    if (secs >= 60) {
      mins += 1;
      secs -= 60;
    }
    return `pace ${mins}:${secs < 10 ? '0' : ''}${secs}/km`;
  });
  
  // 2. Reduce run distances by 15%: e.g. "chạy 10km" -> "chạy 8.5km", "chạy dài 12km" -> "chạy dài 10.2km"
  newDesc = newDesc.replace(/(\d+(\.\d+)?)km/g, (match, p1) => {
    let dist = parseFloat(p1);
    if (dist >= 2) { // only scale distance >= 2km
      let newDist = (dist * 0.85).toFixed(1);
      return `${newDist}km`;
    }
    return match;
  });
  
  // 3. Reduce swim distances by 15% (rounded to nearest 50m): e.g. "Tổng: 600m" -> "Tổng: 510m"
  newDesc = newDesc.replace(/(\d+)m/g, (match, p1) => {
    let dist = parseInt(p1);
    if (dist >= 200) { // only scale totals or main sets >= 200m
      let newDist = Math.round((dist * 0.85) / 50) * 50;
      return `${newDist}m`;
    }
    return match;
  });
  
  return newDesc;
}

function adaptTrainingPlan() {
  const info = getTrainingDayInfo();
  let currentWeekIdx = 0;
  if (info.status === 'active') {
    currentWeekIdx = info.weekIdx;
  }
  
  const nextWeekIdx = currentWeekIdx + 1;
  if (nextWeekIdx >= workoutsData.length) {
    alert("Anh đang ở tuần cuối cùng của giáo án, không thể điều chỉnh tuần tiếp theo!");
    return;
  }
  
  // Apply adaptation rules to next week
  const weekToAdapt = workoutsDataActive[nextWeekIdx];
  const originalWeek = workoutsData[nextWeekIdx]; // template
  
  // Calculate this week's metrics
  const wNum = currentWeekIdx + 1;
  let checkedCount = 0;
  const dayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  dayKeys.forEach(day => {
    if (completedWorkouts[`w${wNum}_${day}`]) {
      checkedCount++;
    }
  });
  const completionRate = (checkedCount / 7) * 100;
  
  const dates = getDatesOfWeek(currentWeekIdx);
  let sleepSum = 0;
  let sleepCount = 0;
  dates.forEach(date => {
    if (sleepScores[date] !== undefined) {
      sleepSum += sleepScores[date];
      sleepCount++;
    }
  });
  const avgSleep = sleepCount > 0 ? Math.round(sleepSum / sleepCount) : null;
  
  // Apply adaptation logic
  let logMsg = "";
  if (completionRate < 60 || (avgSleep !== null && avgSleep < 65)) {
    // FATIGUED: adapt next week by reducing volume and pace
    for (let day in weekToAdapt.days) {
      let originalDay = originalWeek.days[day];
      let adaptedDay = weekToAdapt.days[day];
      adaptedDay.desc = adaptWorkoutText(originalDay.desc);
      adaptedDay.title = adaptWorkoutText(originalDay.title);
    }
    logMsg = `[THÍCH ỨNG] Tuần ${nextWeekIdx + 1}: Đã giảm 15% cự ly và làm chậm pace mục tiêu chạy/bơi đi +10 giây/km do hoàn thành kém (${completionRate.toFixed(0)}%) hoặc thiếu ngủ (${avgSleep !== null ? avgSleep + 'đ' : 'N/A'}).`;
  } else {
    // OPTIMAL: Keep original week targets
    workoutsDataActive[nextWeekIdx] = JSON.parse(JSON.stringify(originalWeek));
    logMsg = `[GIỮ NGUYÊN] Tuần ${nextWeekIdx + 1}: Thể trạng ổn định. Giữ nguyên mục tiêu cự ly và pace của giáo án gốc.`;
  }
  
  localStorage.setItem('adapted_workouts', JSON.stringify(workoutsDataActive));
  
  // Update log display
  const logEl = document.getElementById('adapt-log');
  if (logEl) {
    logEl.innerText = logMsg;
    logEl.style.display = 'block';
  }
  
  // Re-render
  renderSchedule();
  updateTodayTab();
  
  alert(`Đã tự động điều chỉnh giáo án Tuần ${nextWeekIdx + 1} thành công!`);
}

function resetTrainingPlanAdaptation() {
  if (confirm("Anh có chắc muốn khôi phục lại toàn bộ giáo án gốc (không thích ứng)?")) {
    localStorage.removeItem('adapted_workouts');
    workoutsDataActive = JSON.parse(JSON.stringify(workoutsData));
    
    // Hide log
    const logEl = document.getElementById('adapt-log');
    if (logEl) {
      logEl.style.display = 'none';
      logEl.innerText = '';
    }
    
    renderSchedule();
    updateTodayTab();
    updateAdaptabilityStatus();
    
    alert("Đã khôi phục thành công giáo án gốc!");
  }
}

// Global modal variables
let currentAdjustWeekIdx = -1;
let currentAdjustDayKey = '';

// Open adjust workout modal
function openAdjustModal(weekIdx, dayKey) {
  currentAdjustWeekIdx = weekIdx;
  currentAdjustDayKey = dayKey;
  
  const modal = document.getElementById('adjust-modal');
  const subtitle = document.getElementById('adjust-modal-subtitle');
  const swapTarget = document.getElementById('adjust-swap-target');
  
  subtitle.innerText = `Chỉnh sửa bài tập cho ${vnDayNames[dayKey]} - Tuần ${weekIdx + 1}`;
  
  // Reset select elements
  document.getElementById('adjust-action-type').value = 'swap';
  onAdjustActionChange();
  
  // Populate swap targets excluding current day
  swapTarget.innerHTML = '';
  const dayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  dayKeys.forEach(day => {
    if (day !== dayKey) {
      const option = document.createElement('option');
      option.value = day;
      option.innerText = `${vnDayNames[day]}: ${workoutsDataActive[weekIdx].days[day].title}`;
      swapTarget.appendChild(option);
    }
  });
  
  modal.style.display = 'flex';
}

// Close adjust workout modal
function closeAdjustModal() {
  const modal = document.getElementById('adjust-modal');
  modal.style.display = 'none';
}

// Handle adjust action type change
function onAdjustActionChange() {
  const action = document.getElementById('adjust-action-type').value;
  const swapSection = document.getElementById('adjust-swap-section');
  const changeSection = document.getElementById('adjust-change-section');
  
  if (action === 'swap') {
    swapSection.style.display = 'flex';
    changeSection.style.display = 'none';
  } else {
    swapSection.style.display = 'none';
    changeSection.style.display = 'flex';
  }
}

// Default templates for workout types to construct title/desc dynamically
const workoutTemplates = {
  Run_Easy: {
    type: "Run",
    title: "Run: Chạy nhẹ (Easy Run)",
    desc: "Chạy nhẹ nhàng phục hồi: 5-8km @ pace 6:15/km. Giữ nhịp tim ở vùng Zone 2 (hiếu khí nhẹ), thở đều thoải mái."
  },
  Run_Interval: {
    type: "Run",
    title: "Run: Chạy Intervals",
    desc: "Khởi động: 1.5km. Chạy nhanh (intervals): 6x400m @ pace 4:10/km (Nghỉ đi bộ 90s giữa các hiệp). Thả lỏng: 1.5km."
  },
  Run_Tempo: {
    type: "Run",
    title: "Run: Chạy Tempo",
    desc: "Khởi động: 1km. Chạy Tempo: 5km @ pace 4:55/km. Thả lỏng: 1km. Tăng ngưỡng lactate chịu đựng."
  },
  Run_Long: {
    type: "Run",
    title: "Run: Chạy dài (Long Run)",
    desc: "Chạy dài tích lũy 12km @ pace 5:55/km. Tập thở đều. 1km cuối tăng tốc lên pace 4:50/km."
  },
  Swim: {
    type: "Swim",
    title: "Swim: Sức bền",
    desc: "Bơi bền: 3x200m (nghỉ 45s giữa các hiệp). Tổng cự ly: 600m."
  },
  Pickleball: {
    type: "Pickleball",
    title: "Cross-training: Pickleball",
    desc: "Chơi Pickleball 1-2 tiếng. Giữ nhịp di chuyển linh hoạt, hỗ trợ sự dẻo dai và tim mạch."
  },
  Workout: {
    type: "Workout",
    title: "Thể lực: Toàn thân bổ trợ",
    desc: "Squats, lunges, plank, chống đẩy. 45 phút tập luyện hỗ trợ khớp và cơ cốt lõi."
  },
  Rest: {
    type: "Rest",
    title: "Nghỉ ngơi",
    desc: "Nghỉ ngơi dưỡng sức hoặc thả lỏng cơ nhẹ nhàng."
  }
};

// Apply workout adjustment to workoutsDataActive
function applyWorkoutAdjustment() {
  if (currentAdjustWeekIdx === -1 || !currentAdjustDayKey) return;
  
  const action = document.getElementById('adjust-action-type').value;
  const week = workoutsDataActive[currentAdjustWeekIdx];
  
  if (action === 'swap') {
    const targetDay = document.getElementById('adjust-swap-target').value;
    
    // Swap the workouts
    const temp = week.days[currentAdjustDayKey];
    week.days[currentAdjustDayKey] = week.days[targetDay];
    week.days[targetDay] = temp;
    
    // Also swap completion status if needed to maintain consistency
    const currentId = `w${currentAdjustWeekIdx + 1}_${currentAdjustDayKey}`;
    const targetId = `w${currentAdjustWeekIdx + 1}_${targetDay}`;
    const currentStatus = completedWorkouts[currentId];
    const targetStatus = completedWorkouts[targetId];
    
    if (currentStatus) completedWorkouts[targetId] = true; else delete completedWorkouts[targetId];
    if (targetStatus) completedWorkouts[currentId] = true; else delete completedWorkouts[currentId];
    
    localStorage.setItem('completed_workouts', JSON.stringify(completedWorkouts));
  } else {
    // Change workout type and load template
    const templateKey = document.getElementById('adjust-change-workout-type').value;
    const template = workoutTemplates[templateKey];
    
    week.days[currentAdjustDayKey] = {
      type: template.type,
      title: template.title,
      desc: template.desc
    };
    
    // Reset completion status for this day
    const currentId = `w${currentAdjustWeekIdx + 1}_${currentAdjustDayKey}`;
    delete completedWorkouts[currentId];
    localStorage.setItem('completed_workouts', JSON.stringify(completedWorkouts));
  }
  
  // Save updated schedule to localStorage
  localStorage.setItem('adapted_workouts', JSON.stringify(workoutsDataActive));
  
  // Re-render
  renderSchedule();
  updateTodayTab();
  updateAdaptabilityStatus();
  
  closeAdjustModal();
  alert("Đã điều chỉnh kế hoạch tập luyện thành công!");
}
