import React, { useState, useEffect } from "react";
import { 
  auth, 
  db 
} from "./firebase";
import { 
  signInWithCustomToken, 
  signInWithPopup, 
  GoogleAuthProvider, 
  linkWithPopup, 
  unlink, 
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  writeBatch
} from "firebase/firestore";
import { 
  Calendar, 
  Activity, 
  TrendingUp, 
  User as UserIcon, 
  CheckSquare, 
  LogOut, 
  Settings, 
  RefreshCw, 
  Info,
  Edit2
} from "lucide-react";

// Default workout templates
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

const defaultWeeksData = [
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

const PLAN_START_DATE = new Date("2026-07-20T00:00:00");
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const vnDayNames = {
  Mon: "Thứ Hai",
  Tue: "Thứ Ba",
  Wed: "Thứ Tư",
  Thu: "Thứ Năm",
  Fri: "Thứ Sáu",
  Sat: "Thứ Bảy",
  Sun: "Chủ Nhật"
};

function generatePersonalizedSchedule(sports, weight, targetWeight, targetPace) {
  let paceSeconds = 300; // default 5:00
  if (targetPace) {
    const parts = targetPace.split(":");
    if (parts.length === 2) {
      const min = parseInt(parts[0]);
      const sec = parseInt(parts[1]);
      if (!isNaN(min) && !isNaN(sec)) {
        paceSeconds = min * 60 + sec;
      }
    }
  }

  const formatPace = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.round(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const hasSport = (s) => sports.includes(s);
  const weeks = [];

  for (let i = 0; i < 8; i++) {
    const wStart = weight - (weight - targetWeight) * (i / 8);
    const wEnd = weight - (weight - targetWeight) * ((i + 1) / 8);
    const targetStr = `${wStart.toFixed(1)}kg -> ${wEnd.toFixed(1)}kg`;

    const days = {};

    // Monday: Swim technique or Cycle recovery or Rest
    if (hasSport("swim")) {
      const dist = 500 + i * 50;
      days.Mon = {
        type: "Swim",
        title: `Swim: Kỹ thuật bơi tự do (Tuần ${i + 1})`,
        desc: `Khởi động: 100m. Kỹ thuật (drills): 8x50m tập trung phối hợp tay, chân và thở đều. Thả lỏng: 100m. Tổng cự ly: ${dist}m.`
      };
    } else if (hasSport("cycle")) {
      const dist = 15 + i * 2;
      days.Mon = {
        type: "Cycle",
        title: `Cycle: Hồi phục chân (Tuần ${i + 1})`,
        desc: `Đạp xe nhẹ nhàng giữ guồng chân đều (cadence 85-90) trong ${dist}km. Giúp tuần hoàn máu và hồi phục chân.`
      };
    } else {
      days.Mon = {
        type: "Rest",
        title: "Nghỉ ngơi giãn cơ",
        desc: "Nghỉ ngơi hoàn toàn. Thực hiện các bài căng cơ nhẹ nhàng toàn thân."
      };
    }

    // Tuesday: Pickleball or Cycle intervals or Rest
    if (hasSport("pickleball")) {
      days.Tue = {
        type: "Pickleball",
        title: "Pickleball: Cross-training",
        desc: "Chơi Pickleball di chuyển linh hoạt 1-2 tiếng. Giúp rèn phản xạ nhanh và sự dẻo dai."
      };
    } else if (hasSport("cycle") && !hasSport("swim")) {
      const intervals = 4 + Math.floor(i / 2);
      days.Tue = {
        type: "Cycle",
        title: `Cycle: Đạp xe biến tốc Intervals (Tuần ${i + 1})`,
        desc: `Khởi động 5km. Đạp nhanh cường độ cao: ${intervals}x2km (nghỉ 3 phút đạp nhẹ giữa mỗi hiệp). Đạp thả lỏng 3km.`
      };
    } else {
      days.Tue = {
        type: "Rest",
        title: "Nghỉ ngơi tích cực",
        desc: "Đi bộ thư giãn 30 phút hoặc tập các động tác yoga kéo giãn nhẹ nhàng."
      };
    }

    // Wednesday: Quality Run or Cycle Tempo or Rest
    if (hasSport("run")) {
      if ((i + 1) % 2 !== 0) {
        const reps = 5 + Math.floor(i / 2);
        const repDist = i < 4 ? "400m" : "800m";
        const repPace = formatPace(paceSeconds - 20);
        days.Wed = {
          type: "Run",
          title: `Run: Biến tốc Intervals (Tuần ${i + 1})`,
          desc: `Khởi động: 1.5km. Chạy nhanh intervals: ${reps}x${repDist} @ pace ${repPace}/km (Nghỉ đi bộ 90s giữa các hiệp). Thả lỏng: 1.5km.`
        };
      } else {
        const dist = 4 + Math.floor(i / 2);
        const tempoPace = formatPace(paceSeconds + 20);
        days.Wed = {
          type: "Run",
          title: `Run: Chạy Tempo ngưỡng lactate (Tuần ${i + 1})`,
          desc: `Khởi động: 1.5km. Chạy Tempo đều lực: ${dist}km @ pace ${tempoPace}/km. Thả lỏng: 1km. Giúp tăng sức bền tốc độ.`
        };
      }
    } else if (hasSport("cycle")) {
      const dist = 25 + i * 3;
      days.Wed = {
        type: "Cycle",
        title: `Cycle: Đạp xe Tempo đều lực (Tuần ${i + 1})`,
        desc: `Đạp xe giữ tốc độ ổn định cường độ trung bình cao trong ${dist}km.`
      };
    } else {
      days.Wed = {
        type: "Rest",
        title: "Nghỉ ngơi phục hồi",
        desc: "Nghỉ ngơi hoàn toàn, bổ sung nước và dinh dưỡng tốt."
      };
    }

    // Thursday: Pickleball or Cycle Zone 2 or Rest
    if (hasSport("pickleball")) {
      days.Thu = {
        type: "Pickleball",
        title: "Pickleball: Vận động phục hồi",
        desc: "Chơi Pickleball 1-2 tiếng vui vẻ nhẹ nhàng. Tránh quá sức."
      };
    } else if (hasSport("cycle") && hasSport("run")) {
      const dist = 20 + i * 2;
      days.Thu = {
        type: "Cycle",
        title: `Cycle: Đạp xe Zone 2 (Tuần ${i + 1})`,
        desc: `Đạp xe hiếu khí nhẹ nhàng tích lũy cơ địa ${dist}km.`
      };
    } else {
      days.Thu = {
        type: "Rest",
        title: "Nghỉ dưỡng sức",
        desc: "Thư giãn toàn thân chuẩn bị thể lực cho bài tập hôm sau."
      };
    }

    // Friday: Always Strength Workout
    days.Fri = {
      type: "Workout",
      title: "Thể lực: Kháng lực bổ trợ & Core",
      desc: "Plank 3x60s, Squats 3x15, Lunges 3x12, Push-ups 3x12. Hỗ trợ sự thăng bằng và sức mạnh khớp chân gối phòng ngừa chấn thương."
    };

    // Saturday: Long Run or Cycle Long Ride or Rest
    if (hasSport("run")) {
      const dist = 8 + i * 2;
      const longPace = formatPace(paceSeconds + 80);
      days.Sat = {
        type: "Run",
        title: `Run: Chạy dài Long Run (Tuần ${i + 1})`,
        desc: i === 7 
          ? `CHẠY KIỂM TRA HM: Chạy dài 15km @ pace ${formatPace(paceSeconds + 10)} hoặc thử thách chạy đủ 21.1km để lập kỷ lục cá nhân!`
          : `Chạy dài tích lũy sức bền ${dist}km @ pace ${longPace}/km. Giữ nhịp thở đều.`
      };
    } else if (hasSport("cycle")) {
      const dist = 30 + i * 5;
      days.Sat = {
        type: "Cycle",
        title: `Cycle: Đạp xe đường dài Long Ride (Tuần ${i + 1})`,
        desc: `Đạp xe tích lũy bền bỉ quãng đường ${dist}km. Chú ý tư thế đạp xe thoải mái.`
      };
    } else {
      days.Sat = {
        type: "Rest",
        title: "Nghỉ ngơi thư giãn",
        desc: "Tận hưởng ngày nghỉ cuối tuần thoải mái."
      };
    }

    // Sunday: Swim endurance or Cycle Zone 2 or Rest
    if (hasSport("swim")) {
      const dist = 500 + i * 50;
      days.Sun = {
        type: "Swim",
        title: `Swim: Bơi bền thử thách (Tuần ${i + 1})`,
        desc: i === 7
          ? "Thử thách bơi 1000m (1km) liên tục không nghỉ để kết thúc giáo án!"
          : `Bơi bền quãng đường dài: 3x200m bơi liên tục (nghỉ 45s). Tổng cự ly bơi: ${dist}m. Kiểm tra cân nặng.`
      };
    } else if (hasSport("cycle") && !hasSport("run")) {
      const dist = 20 + i * 2;
      days.Sun = {
        type: "Cycle",
        title: `Cycle: Đạp xe hồi phục (Tuần ${i + 1})`,
        desc: `Đạp xe thư giãn nhẹ nhàng ${dist}km. Theo dõi cân nặng cuối tuần.`
      };
    } else {
      days.Sun = {
        type: "Rest",
        title: "Nghỉ ngơi & Đo cân nặng",
        desc: "Đo cân nặng để ghi nhận tiến độ giảm cân tuần này."
      };
    }

    weeks.push({ target: targetStr, days });
  }

  return weeks;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  // Sync data states from Firestore
  const [profile, setProfile] = useState({
    displayName: "",
    weight: 68,
    targetWeight: 62,
    targetPace: "4:30",
    sports: ["run", "swim", "pickleball"]
  });
  const [weeks, setWeeks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [dailyLogs, setDailyLogs] = useState({});

  // Today state calculation
  const [todayInfo, setTodayInfo] = useState({ status: "pre_start" });
  const [sleepScoreVal, setSleepScoreVal] = useState(75);
  const [adaptLogText, setAdaptLogText] = useState("");
  const [showAdaptLog, setShowAdaptLog] = useState(false);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editWeekIdx, setEditWeekIdx] = useState(0);
  const [editDayKey, setEditDayKey] = useState("Mon");
  const [editAction, setEditAction] = useState("swap"); // "swap" or "change"
  const [swapTargetDay, setSwapTargetDay] = useState("Tue");
  const [newWorkoutType, setNewWorkoutType] = useState("Run_Easy");

  // Onboarding profile modal
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingProfile, setOnboardingProfile] = useState({
    displayName: "",
    weight: 68,
    targetWeight: 62,
    targetPace: "4:30",
    sports: ["run", "swim", "pickleball"]
  });
  const [recreateScheduleOnSubmit, setRecreateScheduleOnSubmit] = useState(false);
  const [isOnboardingMode, setIsOnboardingMode] = useState(true);

  // 1. Detect Strava OAuth redirect callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      setCallbackLoading(true);
      // Exchange code for Firebase custom token via local/prod API
      fetch("/api/auth/strava", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to auth with backend");
          return res.json();
        })
        .then(data => {
          const customToken = data.firebaseCustomToken;
          return signInWithCustomToken(auth, customToken).then((cred) => {
            // Once logged in, trigger a backfill fetch in background
            fetch("/api/sync/backfill", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uid: cred.user.uid })
            }).catch(e => console.error("Backfill failed", e));
          });
        })
        .then(() => {
          // Clear query params
          window.history.replaceState({}, document.title, "/");
        })
        .catch(err => {
          console.error(err);
          alert("Lỗi đăng nhập bằng Strava. Vui lòng thử lại!");
        })
        .finally(() => {
          setCallbackLoading(false);
        });
    }
  }, []);

  // 2. Auth State Changed Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Setup real-time listeners for user data
        setupFirestoreListeners(firebaseUser.uid);
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // 3. Set up Firestore Sync Listeners
  const setupFirestoreListeners = (uid) => {
    setLoading(true);
    const userDocRef = doc(db, "users", uid);
    
    // Listen to profile
    const unsubProfile = onSnapshot(userDocRef, async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.profile) {
          setProfile(data.profile);
        } else {
          setIsOnboardingMode(true);
          setRecreateScheduleOnSubmit(true);
          setShowOnboarding(true);
        }
      } else {
        setIsOnboardingMode(true);
        setRecreateScheduleOnSubmit(true);
        setShowOnboarding(true);
      }
    });

    // Listen to schedule weeks
    const scheduleCol = collection(db, "users", uid, "schedule");
    const unsubSchedule = onSnapshot(scheduleCol, async (snap) => {
      if (snap.empty) {
        console.log("Seeding personalized schedule weeks...");
        const userSnap = await getDoc(userDocRef);
        let sports = ["run", "swim", "pickleball"];
        let weight = 68;
        let targetWeight = 62;
        let targetPace = "4:30";
        if (userSnap.exists()) {
          const uData = userSnap.data();
          if (uData.profile) {
            sports = uData.profile.sports || sports;
            weight = uData.profile.weight || weight;
            targetWeight = uData.profile.targetWeight || targetWeight;
            targetPace = uData.profile.targetPace || targetPace;
          }
        }
        const generated = generatePersonalizedSchedule(sports, weight, targetWeight, targetPace);
        const batch = writeBatch(db);
        generated.forEach((week, index) => {
          const weekRef = doc(db, "users", uid, "schedule", `week_${index + 1}`);
          batch.set(weekRef, week);
        });
        await batch.commit();
      } else {
        const sortedWeeks = snap.docs
          .map(d => ({ id: d.id, index: parseInt(d.id.replace("week_", "")) - 1, ...d.data() }))
          .sort((a, b) => a.index - b.index);
        setWeeks(sortedWeeks);
      }
      setLoading(false);
    });

    // Listen to daily logs
    const logsCol = collection(db, "users", uid, "daily_logs");
    const unsubLogs = onSnapshot(logsCol, (snap) => {
      const logs = {};
      snap.docs.forEach(d => {
        logs[d.id] = d.data();
      });
      setDailyLogs(logs);
    });

    // Listen to recent activities (limit 50)
    const actsCol = collection(db, "users", uid, "activities");
    const actsQuery = query(actsCol, orderBy("start_date_local", "desc"), limit(50));
    const unsubActs = onSnapshot(actsQuery, (snap) => {
      const acts = snap.docs.map(d => d.data());
      setActivities(acts);
    });

    return () => {
      unsubProfile();
      unsubSchedule();
      unsubLogs();
      unsubActs();
    };
  };

  // 4. Calculate today training info relative to start date
  useEffect(() => {
    const interval = setInterval(() => {
      calculateToday();
    }, 60000);
    calculateToday();
    return () => clearInterval(interval);
  }, [weeks]);

  const calculateToday = () => {
    const testDate = new Date();
    const diffTime = testDate - PLAN_START_DATE;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      setTodayInfo({ status: "pre_start", diffDays });
      return;
    }
    
    const weekIdx = Math.floor(diffDays / 7);
    const dayIdx = diffDays % 7;
    const dayKey = daysOfWeek[dayIdx];
    
    if (weeks.length === 0 || weekIdx >= weeks.length) {
      setTodayInfo({ status: "finished" });
      return;
    }
    
    const weekData = weeks[weekIdx];
    const workout = weekData.days[dayKey];
    const dateString = testDate.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" });
    const todayLogKey = testDate.toISOString().split("T")[0]; // YYYY-MM-DD
    
    setTodayInfo({
      status: "active",
      weekNum: weekIdx + 1,
      weekIdx,
      dayKey,
      workout,
      dateString,
      logKey: todayLogKey,
      target: weekData.target
    });

    // Initialize sleep score slider label from existing log if exists
    const existingLog = dailyLogs[todayLogKey];
    if (existingLog && existingLog.sleepScore !== undefined) {
      setSleepScoreVal(existingLog.sleepScore);
    }
  };

  // 5. Actions on database
  const toggleTodayWorkout = async () => {
    if (todayInfo.status !== "active") return;
    const logKey = todayInfo.logKey;
    const workoutId = `w${todayInfo.weekNum}_${todayInfo.dayKey}`;
    
    const userLogRef = doc(db, "users", user.uid, "daily_logs", logKey);
    const logSnap = await getDoc(userLogRef);
    let completedList = [];
    
    if (logSnap.exists()) {
      completedList = logSnap.data().completedTasks || [];
    }
    
    if (completedList.includes(workoutId)) {
      completedList = completedList.filter(id => id !== workoutId);
    } else {
      completedList.push(workoutId);
    }
    
    await setDoc(userLogRef, { completedTasks: completedList }, { merge: true });
  };

  const saveSleepScore = async () => {
    if (todayInfo.status !== "active") return;
    const logKey = todayInfo.logKey;
    const userLogRef = doc(db, "users", user.uid, "daily_logs", logKey);
    await setDoc(userLogRef, { sleepScore: sleepScoreVal }, { merge: true });
    alert(`Đã lưu chỉ số giấc ngủ: ${sleepScoreVal} điểm!`);
  };

  const toggleWorkoutStatus = async (weekNum, dayKey) => {
    // Generate dates based on starting date + week and day offset
    const weekOffset = weekNum - 1;
    const dayOffset = daysOfWeek.indexOf(dayKey);
    const targetDate = new Date(PLAN_START_DATE.getTime() + (weekOffset * 7 + dayOffset) * 24 * 3600 * 1000);
    const logKey = targetDate.toISOString().split("T")[0];
    
    const workoutId = `w${weekNum}_${dayKey}`;
    const userLogRef = doc(db, "users", user.uid, "daily_logs", logKey);
    const logSnap = await getDoc(userLogRef);
    let completedList = [];
    
    if (logSnap.exists()) {
      completedList = logSnap.data().completedTasks || [];
    }
    
    if (completedList.includes(workoutId)) {
      completedList = completedList.filter(id => id !== workoutId);
    } else {
      completedList.push(workoutId);
    }
    
    await setDoc(userLogRef, { completedTasks: completedList }, { merge: true });
  };

  // 6. Adaptation Engine
  const adaptTrainingPlan = async () => {
    if (todayInfo.status !== "active") {
      alert("Chương trình chưa bắt đầu hoặc đã kết thúc!");
      return;
    }
    
    const currentWeekIdx = todayInfo.weekIdx;
    const currentWeekNum = currentWeekIdx + 1;
    
    if (currentWeekIdx >= 7) {
      alert("Đang ở tuần cuối cùng, không cần thiết điều chỉnh tiếp!");
      return;
    }
    
    // Calculate stats for current week (Mon-Sun logs)
    let completedCount = 0;
    let sleepSum = 0;
    let sleepCount = 0;
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDate = new Date(PLAN_START_DATE.getTime() + (currentWeekIdx * 7 + dayOffset) * 24 * 3600 * 1000);
      const logKey = targetDate.toISOString().split("T")[0];
      const log = dailyLogs[logKey];
      
      if (log) {
        const dayKey = daysOfWeek[dayOffset];
        const workoutId = `w${currentWeekNum}_${dayKey}`;
        if (log.completedTasks && log.completedTasks.includes(workoutId)) {
          completedCount++;
        }
        if (log.sleepScore !== undefined) {
          sleepSum += log.sleepScore;
          sleepCount++;
        }
      }
    }
    
    const completionRate = completedCount / 7;
    const avgSleep = sleepCount > 0 ? sleepSum / sleepCount : 75;
    
    let logs = [];
    logs.push(`=== PHÂN TÍCH TUẦN ${currentWeekNum} ===`);
    logs.push(`- Tỷ lệ hoàn thành: ${(completionRate * 100).toFixed(0)}% (${completedCount}/7 bài)`);
    logs.push(`- Giấc ngủ trung bình: ${avgSleep.toFixed(0)} điểm`);
    
    // Clone next week's schedule
    const nextWeekIdx = currentWeekIdx + 1;
    const nextWeekRef = doc(db, "users", user.uid, "schedule", `week_${nextWeekIdx + 1}`);
    const nextWeekSnap = await getDoc(nextWeekRef);
    
    if (!nextWeekSnap.exists()) {
      alert(`Không tìm thấy dữ liệu Tuần ${nextWeekIdx + 1}`);
      return;
    }
    
    const nextWeekData = { ...nextWeekSnap.data() };
    let planModified = false;
    
    // Logic 1: Under-training (Completion < 60%) -> Scale down next week's runs
    if (completionRate < 0.60) {
      logs.push(`⚠️ Tải trọng tuần này thấp (<60%). Giảm 20% cự ly chạy dài tuần sau.`);
      for (const day of daysOfWeek) {
        const workout = nextWeekData.days[day];
        if (workout.type === "Run" && workout.title.includes("Chạy dài")) {
          // Extract distance (e.g. 12km) and decrease it
          const match = workout.desc.match(/(\d+)km/);
          if (match) {
            const oldDist = parseInt(match[1]);
            const newDist = Math.max(8, Math.round(oldDist * 0.8));
            nextWeekData.days[day].desc = workout.desc.replace(`${oldDist}km`, `${newDist}km`) + " (Đã giảm tải)";
            planModified = true;
          }
        }
      }
    }
    
    // Logic 2: Severe sleep deprivation (Sleep avg < 60) -> Replace one Pickleball session with Rest
    if (avgSleep < 60) {
      logs.push(`⚠️ Giấc ngủ kém (<60 điểm). Thay một buổi Pickleball tuần sau bằng Nghỉ ngơi.`);
      for (const day of daysOfWeek) {
        const workout = nextWeekData.days[day];
        if (workout.type === "Pickleball") {
          nextWeekData.days[day] = {
            type: "Rest",
            title: "Nghỉ ngơi hồi phục (Do thiếu ngủ)",
            desc: "Ưu tiên ngủ đủ giấc 7-8 tiếng tối nay. Nghỉ ngơi thả lỏng cơ hoàn toàn."
          };
          planModified = true;
          break; // only replace one session
        }
      }
    }
    
    // Logic 3: Overperforming (Completion > 90% and Sleep > 75) -> Increase long run by 10%
    if (completionRate >= 0.90 && avgSleep >= 75) {
      logs.push(`🚀 Quá tốt! Tỷ lệ hoàn thành cao và cơ thể phục hồi tốt. Tăng 10% cự ly chạy dài tuần sau.`);
      for (const day of daysOfWeek) {
        const workout = nextWeekData.days[day];
        if (workout.type === "Run" && workout.title.includes("Chạy dài")) {
          const match = workout.desc.match(/(\d+)km/);
          if (match) {
            const oldDist = parseInt(match[1]);
            const newDist = Math.min(22, Math.round(oldDist * 1.1));
            nextWeekData.days[day].desc = workout.desc.replace(`${oldDist}km`, `${newDist}km`) + " (Đã tăng cường)";
            planModified = true;
          }
        }
      }
    }

    if (planModified) {
      await updateDoc(nextWeekRef, { days: nextWeekData.days });
      logs.push(`✅ Đã lưu thay đổi giáo án Tuần ${nextWeekIdx + 1} vào Firestore.`);
    } else {
      logs.push(`👉 Cơ thể thích ứng ở mức bình thường. Giáo án Tuần ${nextWeekIdx + 1} được giữ nguyên.`);
    }
    
    setAdaptLogText(logs.join("\n"));
    setShowAdaptLog(true);
  };

  const resetTrainingPlanAdaptation = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn khôi phục toàn bộ giáo án 8 tuần về mặc định gốc không?")) {
      return;
    }
    const batch = writeBatch(db);
    defaultWeeksData.forEach((week, index) => {
      const weekRef = doc(db, "users", user.uid, "schedule", `week_${index + 1}`);
      batch.set(weekRef, week);
    });
    await batch.commit();
    setAdaptLogText("Đã khôi phục toàn bộ giáo án về mặc định gốc thành công.");
    setShowAdaptLog(true);
  };

  // 7. Modals: Edit Workout Day
  const openAdjustModal = (weekIdx, dayKey) => {
    setEditWeekIdx(weekIdx);
    setEditDayKey(dayKey);
    setSwapTargetDay(daysOfWeek.find(d => d !== dayKey) || "Tue");
    setShowEditModal(true);
  };

  const handleApplyAdjustment = async () => {
    const weekRef = doc(db, "users", user.uid, "schedule", `week_${editWeekIdx + 1}`);
    const weekSnap = await getDoc(weekRef);
    if (!weekSnap.exists()) return;
    
    const weekData = weekSnap.data();
    const newDays = { ...weekData.days };

    if (editAction === "swap") {
      // Swap days
      const temp = { ...newDays[editDayKey] };
      newDays[editDayKey] = { ...newDays[swapTargetDay] };
      newDays[swapTargetDay] = temp;
    } else {
      // Change to new template
      const template = workoutTemplates[newWorkoutType];
      if (template) {
        newDays[editDayKey] = {
          type: template.type,
          title: template.title,
          desc: template.desc
        };
      }
    }

    await updateDoc(weekRef, { days: newDays });
    setShowEditModal(false);
  };

  // 8. Onboarding Complete Handler
  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    if (!onboardingProfile.displayName.trim()) {
      alert("Vui lòng điền họ tên hiển thị!");
      return;
    }
    if (!onboardingProfile.sports || onboardingProfile.sports.length === 0) {
      alert("Vui lòng chọn ít nhất một môn thể thao tập luyện!");
      return;
    }
    
    const userDocRef = doc(db, "users", user.uid);
    const batch = writeBatch(db);
    
    // Save profile data
    batch.set(userDocRef, {
      profile: {
        displayName: onboardingProfile.displayName,
        weight: parseFloat(onboardingProfile.weight),
        targetWeight: parseFloat(onboardingProfile.targetWeight),
        targetPace: onboardingProfile.targetPace,
        sports: onboardingProfile.sports,
        createdAt: new Date().toISOString()
      }
    }, { merge: true });

    // Recreate schedule if requested
    if (recreateScheduleOnSubmit) {
      console.log("Generating and writing personalized schedule...");
      const generated = generatePersonalizedSchedule(
        onboardingProfile.sports,
        parseFloat(onboardingProfile.weight),
        parseFloat(onboardingProfile.targetWeight),
        onboardingProfile.targetPace
      );
      generated.forEach((week, index) => {
        const weekRef = doc(db, "users", user.uid, "schedule", `week_${index + 1}`);
        batch.set(weekRef, week);
      });
    }

    await batch.commit();
    setShowOnboarding(false);
  };

  // 9. Link Google recovery account
  const handleLinkGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await linkWithPopup(auth.currentUser, provider);
      alert("Đã liên kết tài khoản Google dự phòng thành công!");
      // Reload profile sync
      setupFirestoreListeners(user.uid);
    } catch (e) {
      console.error(e);
      alert(`Liên kết thất bại: ${e.message}`);
    }
  };

  const handleUnlinkGoogle = async () => {
    try {
      await unlink(auth.currentUser, "google.com");
      alert("Đã hủy liên kết tài khoản Google.");
      setupFirestoreListeners(user.uid);
    } catch (e) {
      console.error(e);
      alert(`Hủy liên kết thất bại: ${e.message}`);
    }
  };

  const handleStravaSignOut = () => {
    signOut(auth).then(() => {
      setUser(null);
      setActiveTab("today");
    });
  };

  // 10. Login flows
  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(e => {
      console.error(e);
      alert(`Đăng nhập Google thất bại: ${e.message}`);
    });
  };

  const handleStravaOAuthRedirect = () => {
    const client_id = "265757";
    const redirect_uri = encodeURIComponent(window.location.origin);
    const scope = "activity:read_all";
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&approval_prompt=auto&scope=${scope}&state=firebase_auth`;
    window.location.href = authUrl;
  };

  // Draw Weight Chart SVG dynamically
  const renderWeightChart = () => {
    // Generate dates & weight values
    // Using starting date, let's map week target weights
    const startW = profile.weight || 68.0;
    const targetW = profile.targetWeight || 62.0;
    const wDiff = (startW - targetW) / 8.0;

    const coords = [];
    for (let i = 0; i <= 8; i++) {
      const x = i * 62.5; // width = 500
      // Calculate y coordinate based on standard progress line or logged weights
      // Let's check daily weights logged on Sundays (checking test target weight logs)
      const weekDate = new Date(PLAN_START_DATE.getTime() + i * 7 * 24 * 3600 * 1000);
      const logKey = weekDate.toISOString().split("T")[0];
      const log = dailyLogs[logKey];
      
      let weight = startW - (wDiff * i);
      if (log && log.weight !== undefined) {
        weight = log.weight;
      }
      
      // Map weight value (e.g. 68 to 62) to Y coordinates (100 to 20)
      const pct = (weight - targetW) / (startW - targetW + 0.1);
      const y = 100 - (pct * 80); // values mapped between 20 and 100
      coords.push({ x, y, weight });
    }

    const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
    const areaPath = coords.length > 0 
      ? `${linePath} L 500 120 L 0 120 Z` 
      : "";

    return (
      <svg className="weight-chart-svg" viewBox="0 0 500 120">
        <defs>
          <linearGradient id="weight-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffd700" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Grids */}
        <line x1="0" y1="20" x2="500" y2="20" stroke="#2e3244" strokeDasharray="5,5" />
        <line x1="0" y1="60" x2="500" y2="60" stroke="#2e3244" strokeDasharray="5,5" />
        <line x1="0" y1="100" x2="500" y2="100" stroke="#2e3244" strokeDasharray="5,5" />
        
        {/* Draw Area & Line */}
        {areaPath && <path className="weight-area" d={areaPath} />}
        {linePath && <path className="weight-line" d={linePath} />}
        
        {/* Dots */}
        {coords.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="5" fill="#ffd700" />
            <text x={c.x} y={c.y - 8} fontSize="9" fill="#a0a5b5" textAnchor="middle">
              {c.weight.toFixed(1)}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  // Helper formats
  const formatPace = (secPerM) => {
    let speed = 1.0 / secPerM; // speed in meters per sec
    let minPerKm = 1000.0 / (speed * 60.0);
    let mins = Math.floor(minPerKm);
    let secs = Math.floor((minPerKm - mins) * 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (callbackLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <RefreshCw className="nav-icon animate-spin" style={{ margin: "0 auto 16px auto", color: "var(--accent-swim)" }} />
          <h2>Đang đồng bộ Strava...</h2>
          <p>Hệ thống đang xác thực tài khoản và tải dữ liệu tập luyện của bạn từ Strava. Vui lòng chờ trong giây lát.</p>
        </div>
      </div>
    );
  }

  // 11. Loading screen
  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <RefreshCw className="nav-icon animate-spin" style={{ margin: "0 auto 16px auto", color: "var(--accent-run)" }} />
          <h2>Đang tải dữ liệu...</h2>
        </div>
      </div>
    );
  }

  // 12. If not authenticated, render Login Page
  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏃‍♂️⚡🚴‍♂️</div>
          <h2>SPORTS APP MULTI-USER</h2>
          <p>Nâng cấp giáo án cá nhân hóa tự thích ứng. Tự động đồng bộ các bài chạy bộ, bơi lội, Pickleball từ tài khoản Strava của riêng bạn.</p>
          
          <button className="btn-strava-login" onClick={handleStravaOAuthRedirect}>
            Đăng nhập bằng Strava
          </button>
          
          <div style={{ color: "var(--text-secondary)", fontSize: "12px", margin: "16px 0" }}>HOẶC ĐĂNG NHẬP DỰ PHÒNG</div>
          
          <button className="btn-google-login" onClick={handleGoogleSignIn}>
            Đăng nhập bằng Google
          </button>
        </div>
      </div>
    );
  }

  // Calculate some stats from Strava activities
  const runs = activities.filter(a => (a.sport_type || a.type) === "Run");
  const swims = activities.filter(a => (a.sport_type || a.type) === "Swim");
  const pickleballs = activities.filter(a => (a.sport_type || a.type) === "Pickleball");
  const workouts = activities.filter(a => (a.sport_type || a.type) === "Workout");
  
  const totalRunM = runs.reduce((sum, r) => sum + r.distance, 0);
  const totalRunKm = totalRunM / 1000.0;
  
  let avgRunPaceStr = "0:00 /km";
  const totalTimeS = runs.reduce((sum, r) => sum + r.moving_time, 0);
  if (totalTimeS > 0) {
    let speed = totalRunM / totalTimeS;
    let minPerKm = 1000.0 / (speed * 60.0);
    let mins = Math.floor(minPerKm);
    let secs = Math.floor((minPerKm - mins) * 60);
    avgRunPaceStr = `${mins}:${secs < 10 ? "0" : ""}${secs} /km`;
  }

  return (
    <>
      {/* App Header */}
      <header class="app-header">
        <h1>GIÁO ÁN LUYỆN TẬP 8 TUẦN</h1>
        <p>
          Hội viên: {profile.displayName || "Chưa thiết lập"} | 
          Môn tập: {(profile.sports || ["run", "swim", "pickleball"]).map(s => s === "run" ? "🏃Chạy" : s === "swim" ? "🏊Bơi" : s === "pickleball" ? "🏓Pickleball" : "🚴Đạp xe").join(", ")} | 
          Cân nặng: {profile.weight}kg → {profile.targetWeight}kg
        </p>
      </header>

      {/* Main Content panels */}
      <main className="app-content">
        
        {/* Tab 1: Hôm nay */}
        {activeTab === "today" && (
          <section>
            {todayInfo.status === "pre_start" && (
              <div className="card" style={{ borderLeft: "4px solid var(--accent-pickle)" }}>
                <div className="card-title">Chương trình chưa bắt đầu</div>
                <div className="workout-desc">Giáo án 8 tuần của bạn được lên lịch bắt đầu vào Thứ Hai, 20/07/2026. Hãy nghỉ ngơi dưỡng sức hoặc tập nhẹ hồi phục!</div>
              </div>
            )}

            {todayInfo.status === "finished" && (
              <div className="card" style={{ borderLeft: "4px solid var(--accent-run)" }}>
                <div className="card-title">Xin chúc mừng! 🎉</div>
                <div className="workout-desc">Bạn đã hoàn thành xuất sắc giáo án luyện tập 8 tuần! Hãy duy trì phong độ và thiết lập mục tiêu mới!</div>
              </div>
            )}

            {todayInfo.status === "active" && (
              <>
                <div className="today-header">
                  <div className="today-date">{todayInfo.dateString}</div>
                  <div className="weight-target">Mục tiêu: {todayInfo.target}</div>
                </div>

                <div className="card">
                  <div className="card-title">
                    <span>BÀI TẬP HÔM NAY</span>
                    <span className={`badge badge-${todayInfo.workout.type.toLowerCase()}`}>
                      {todayInfo.workout.type === "Run" ? "Chạy bộ" : todayInfo.workout.type === "Swim" ? "Bơi lội" : todayInfo.workout.type === "Workout" ? "Cơ lực" : todayInfo.workout.type === "Rest" ? "Nghỉ ngơi" : todayInfo.workout.type}
                    </span>
                  </div>
                  <div className="workout-main">
                    <div className="workout-name">{todayInfo.workout.title}</div>
                    <div className="workout-desc">{todayInfo.workout.desc}</div>
                  </div>
                  
                  {(() => {
                    const workoutId = `w${todayInfo.weekNum}_${todayInfo.dayKey}`;
                    const log = dailyLogs[todayInfo.logKey];
                    const isCompleted = log && log.completedTasks && log.completedTasks.includes(workoutId);
                    
                    return (
                      <button 
                        className={`btn-complete ${isCompleted ? "done" : ""}`} 
                        onClick={toggleTodayWorkout}
                      >
                        {isCompleted ? "✓ Đã Hoàn Thành" : "Đánh dấu Hoàn thành"}
                      </button>
                    );
                  })()}
                </div>

                <div className="card">
                  <div className="card-title">
                    <span>GHI NHẬN GIẤC NGỦ ĐÊM QUA</span>
                    <span>🌙</span>
                  </div>
                  <div style={{ margin: "8px 0 16px 0" }}>
                    <div style={{ display: "flex", justifySpaceBetween: "space-between", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Chất lượng giấc ngủ:</span>
                      <span style={{ fontWeight: 700, color: "var(--accent-swim)" }}>
                        {sleepScoreVal} điểm ({sleepScoreVal >= 85 ? "Rất tốt" : sleepScoreVal >= 70 ? "Tốt" : sleepScoreVal >= 50 ? "Khá" : "Kém"})
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={sleepScoreVal} 
                      style={{ width: "100%", accentColor: "var(--accent-swim)" }} 
                      onChange={(e) => setSleepScoreVal(parseInt(e.target.value))}
                    />
                  </div>
                  <button 
                    className="btn-complete" 
                    style={{ background: "transparent", border: "2px solid var(--accent-swim)", color: "var(--accent-swim)", fontSize: "14px", padding: "10px" }}
                    onClick={saveSleepScore}
                  >
                    Lưu Chỉ Số Giấc Ngủ
                  </button>
                </div>
              </>
            )}

            <div className="card">
              <div className="card-title">Chỉ số Dinh dưỡng & Cân nặng</div>
              <div style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--text-secondary)" }}>
                <p>• <strong>Kế hoạch calo:</strong> Ăn khoảng 1,700 - 1,800 kcal/ngày.</p>
                <p>• <strong>Đạm (Protein):</strong> Ăn khoảng 110g - 130g đạm mỗi ngày để tránh mất cơ khi giảm cân.</p>
                <p>• <strong>Uống nước:</strong> Ít nhất 2.5 - 3 lít nước mỗi ngày.</p>
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Lịch trình */}
        {activeTab === "schedule" && (
          <section>
            {weeks.map((week, wIdx) => (
              <div key={week.id} style={{ marginBottom: "16px" }}>
                <div className="week-header">
                  <span>Tuần {wIdx + 1}</span>
                  <span className="week-target-text">Mục tiêu cân nặng: {week.target}</span>
                </div>
                
                <div className="week-days">
                  {daysOfWeek.map(day => {
                    const workout = week.days[day];
                    const vnDay = vnDayNames[day];
                    const workoutId = `w${wIdx + 1}_${day}`;
                    
                    // Retrieve completion date based on week/day
                    const weekOffset = wIdx;
                    const dayOffset = daysOfWeek.indexOf(day);
                    const targetDate = new Date(PLAN_START_DATE.getTime() + (weekOffset * 7 + dayOffset) * 24 * 3600 * 1000);
                    const logKey = targetDate.toISOString().split("T")[0];
                    const log = dailyLogs[logKey];
                    const isCompleted = log && log.completedTasks && log.completedTasks.includes(workoutId);

                    return (
                      <div key={day} className="day-row">
                        <div className="day-label">{vnDay}</div>
                        <div className="day-info">
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span className="day-title">{workout.title}</span>
                            <span className={`badge badge-${workout.type.toLowerCase()}`}>
                              {workout.type === "Run" ? "Chạy bộ" : workout.type === "Swim" ? "Bơi lội" : workout.type === "Workout" ? "Cơ lực" : workout.type === "Rest" ? "Nghỉ ngơi" : workout.type}
                            </span>
                            <button className="edit-btn-inline" onClick={() => openAdjustModal(wIdx, day)}>Sửa</button>
                          </div>
                          <div className="day-desc">{workout.desc}</div>
                        </div>
                        <label className="checkbox-container">
                          <input 
                            type="checkbox" 
                            checked={isCompleted || false} 
                            onChange={() => toggleWorkoutStatus(wIdx + 1, day)}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Tab 3: Thống kê */}
        {activeTab === "stats" && (
          <section>
            <div className="card">
              <div className="card-title">Tiến trình Giảm cân ({profile.weight}kg → {profile.targetWeight}kg)</div>
              <div style={{ margin: "10px 0" }}>
                {renderWeightChart()}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-secondary)", padding: "0 10px" }}>
                  <span>Bắt đầu ({profile.weight}kg)</span>
                  <span>Tuần 2</span>
                  <span>Tuần 4</span>
                  <span>Tuần 6</span>
                  <span>Tuần 8 ({profile.targetWeight}kg)</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Cự ly chạy dài cuối tuần (km)</div>
              <div className="chart-container">
                {weeks.map((week, idx) => {
                  const satWorkout = week.days["Sat"];
                  let dist = 10;
                  const match = satWorkout && satWorkout.desc.match(/(\d+)km/);
                  if (match) dist = parseInt(match[1]);
                  
                  const isFinished = idx < (todayInfo.weekIdx || 0);

                  return (
                    <div key={idx} className="chart-bar-wrapper">
                      <span className="chart-bar-val">{dist}</span>
                      <div 
                        className="chart-bar" 
                        style={{ 
                          height: `${(dist / 20.0) * 100}%`, 
                          background: isFinished ? "rgba(0, 240, 255, 0.4)" : idx === todayInfo.weekIdx ? "var(--accent-run)" : "linear-gradient(0deg, #1e3c72, var(--accent-swim))"
                        }}
                      ></div>
                      <span className="chart-bar-label">T{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-title">
                <span>ĐIỀU CHỈNH GIÁO ÁN LINH HOẠT</span>
                <span>⚙️</span>
              </div>
              <div style={{ fontSize: "13px", lineHeight: "1.6", color: "var(--text-secondary)" }}>
                <p>Hệ thống tự thích ứng dựa trên giấc ngủ trung bình và tỷ lệ hoàn thành bài tập của tuần hiện tại.</p>
                <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                  <button className="btn-complete" onClick={adaptTrainingPlan} style={{ fontSize: "13px", padding: "10px", flex: 1 }}>Tự động Điều chỉnh Tuần sau</button>
                  <button className="btn-complete" onClick={resetTrainingPlanAdaptation} style={{ fontSize: "13px", padding: "10px", background: "transparent", border: "1px solid var(--text-secondary)", color: "var(--text-secondary)", flex: 1 }}>Khôi phục Gốc</button>
                </div>
                
                {showAdaptLog && (
                  <div style={{ marginTop: "12px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px", fontStyle: "normal", color: "var(--accent-run)", fontFamily: "monospace", display: "block", lineHeight: "1.4", whiteSpace: "pre-wrap" }}>
                    {adaptLogText}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Tab 4: Strava */}
        {activeTab === "strava" && (
          <section>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-label">Tổng cự ly chạy 3T</div>
                <div className="stat-value">{totalRunKm.toFixed(1)} km</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Pace chạy trung bình</div>
                <div className="stat-value">{avgRunPaceStr}</div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-label">Số buổi Pickleball</div>
                <div className="stat-value" style={{ color: "var(--accent-pickle)" }}>{pickleballs.length} buổi</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Số buổi Workout</div>
                <div className="stat-value" style={{ color: "var(--accent-strength)" }}>{workouts.length} buổi</div>
              </div>
            </div>

            <h3 style={{ fontSize: "16px", margin: "16px 0 10px 0" }}>Hoạt động Strava gần đây</h3>
            <div>
              {activities.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: "20px" }}>Chưa có hoạt động nào được đồng bộ.</div>
              ) : (
                activities.slice(0, 15).map(act => {
                  const sport = act.sport_type || act.type;
                  const isRun = sport === "Run";
                  const isSwim = sport === "Swim";
                  const isPickle = sport === "Pickleball";
                  const isWorkout = sport === "Workout";
                  
                  let cardClass = "strava-activity-card";
                  if (isSwim) cardClass += " strava-activity-swim";
                  if (isPickle) cardClass += " strava-activity-pickle";
                  if (isWorkout) cardClass += " strava-activity-workout";
                  
                  const dateStr = act.start_date_local 
                    ? new Date(act.start_date_local).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
                    : "";
                  
                  let mainMetric = sport;
                  let subMetric = `${Math.floor(act.moving_time / 60)} phút`;
                  
                  if (isRun) {
                    mainMetric = `${(act.distance / 1000.0).toFixed(2)} km`;
                    let speed = act.distance / act.moving_time;
                    let minPerKm = 1000.0 / (speed * 60.0);
                    let mins = Math.floor(minPerKm);
                    let secs = Math.floor((minPerKm - mins) * 60);
                    subMetric = `${mins}:${secs < 10 ? "0" : ""}${secs}/km`;
                  } else if (isSwim) {
                    mainMetric = `${act.distance.toFixed(0)} m`;
                  }

                  return (
                    <a 
                      key={act.id} 
                      href={`https://www.strava.com/activities/${act.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={cardClass}
                      style={{ textDecoration: "none", color: "inherit", display: "flex" }}
                    >
                      <div className="strava-act-info">
                        <h4>{act.name}</h4>
                        <p>{dateStr} • {isRun ? "Chạy bộ" : isSwim ? "Bơi lội" : sport}</p>
                      </div>
                      <div className="strava-act-metrics">
                        <div className="strava-act-main-metric">{mainMetric}</div>
                        <div className="strava-act-sub-metric">{subMetric}</div>
                      </div>
                    </a>
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* Tab 5: Cài đặt / Cá nhân */}
        {activeTab === "profile" && (
          <section>
            <div className="card">
              <div className="card-title">Thông tin Tài khoản</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="settings-item">
                  <span className="settings-label">Họ và tên</span>
                  <span className="settings-value">{profile.displayName || "Chưa thiết lập"}</span>
                </div>
                <div className="settings-item">
                  <span className="settings-label">Định danh Firebase</span>
                  <span className="settings-value" style={{ fontSize: "11px", fontFamily: "monospace" }}>{user.uid}</span>
                </div>
                <div className="settings-item">
                  <span className="settings-label">Email đăng nhập</span>
                  <span className="settings-value">{user.email || "Đăng nhập bằng Strava"}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Mục tiêu của tôi</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="settings-item">
                  <span className="settings-label">Môn tập luyện</span>
                  <span className="settings-value">
                    {(profile.sports || ["run", "swim", "pickleball"]).map(s => s === "run" ? "Chạy bộ" : s === "swim" ? "Bơi lội" : s === "pickleball" ? "Pickleball" : "Đạp xe").join(", ")}
                  </span>
                </div>
                <div className="settings-item">
                  <span className="settings-label">Cân nặng hiện tại</span>
                  <span className="settings-value">{profile.weight} kg</span>
                </div>
                <div className="settings-item">
                  <span className="settings-label">Cân nặng mục tiêu</span>
                  <span className="settings-value">{profile.targetWeight} kg</span>
                </div>
                <div className="settings-item">
                  <span className="settings-label">Pace chạy mục tiêu</span>
                  <span className="settings-value">{profile.targetPace} /km</span>
                </div>
              </div>
              <button 
                className="btn-complete" 
                style={{ background: "transparent", border: "2px solid var(--accent-pickle)", color: "var(--accent-pickle)", marginTop: "16px", fontSize: "14px" }}
                onClick={() => {
                  setOnboardingProfile({ ...profile, sports: profile.sports || ["run", "swim", "pickleball"] });
                  setIsOnboardingMode(false);
                  setRecreateScheduleOnSubmit(false);
                  setShowOnboarding(true);
                }}
              >
                Chỉnh sửa thông số mục tiêu
              </button>
            </div>

            <div className="card">
              <div className="card-title">Kết nối & Bảo mật</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  Hãy liên kết tài khoản Google. Để đề phòng khi Strava bị thu hồi quyền hoặc ứng dụng Strava gặp lỗi, bạn vẫn có thể đăng nhập bằng Google để khôi phục quyền truy cập giáo án.
                </p>
                {user.providerData.some(p => p.providerId === "google.com") ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--accent-run)", fontWeight: 600, fontSize: "14px" }}>✓ Đã liên kết Google</span>
                    <button 
                      onClick={handleUnlinkGoogle}
                      style={{ padding: "6px 12px", background: "transparent", border: "1px solid var(--accent-strength)", color: "var(--accent-strength)", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}
                    >
                      Hủy liên kết
                    </button>
                  </div>
                ) : (
                  <button className="btn-google-login" onClick={handleLinkGoogle}>
                    Liên kết với tài khoản Google
                  </button>
                )}
              </div>
            </div>

            <button className="btn-complete" style={{ background: "var(--border-color)", color: "#fff", marginTop: "24px" }} onClick={handleStravaSignOut}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <LogOut size={16} />
                Đăng xuất
              </div>
            </button>
          </section>
        )}
      </main>

      {/* Navigation footer */}
      <nav className="app-nav">
        <button className={`nav-item ${activeTab === "today" ? "active" : ""}`} onClick={() => setActiveTab("today")}>
          <Calendar className="nav-icon" size={20} />
          <span>Hôm nay</span>
        </button>
        <button className={`nav-item ${activeTab === "schedule" ? "active" : ""}`} onClick={() => setActiveTab("schedule")}>
          <CheckSquare className="nav-icon" size={20} />
          <span>Lịch trình</span>
        </button>
        <button className={`nav-item ${activeTab === "stats" ? "active" : ""}`} onClick={() => setActiveTab("stats")}>
          <TrendingUp className="nav-icon" size={20} />
          <span>Thống kê</span>
        </button>
        <button className={`nav-item ${activeTab === "strava" ? "active" : ""}`} onClick={() => setActiveTab("strava")}>
          <Activity className="nav-icon" size={20} />
          <span>Strava</span>
        </button>
        <button className={`nav-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
          <UserIcon className="nav-icon" size={20} />
          <span>Cá nhân</span>
        </button>
      </nav>

      {/* Adjust workout day Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Chỉnh sửa bài tập - Tuần {editWeekIdx + 1}, {vnDayNames[editDayKey]}</h3>
            
            <div className="form-group">
              <label>HÀNH ĐỘNG</label>
              <select value={editAction} onChange={(e) => setEditAction(e.target.value)}>
                <option value="swap">Đổi ngày với bài tập khác trong tuần</option>
                <option value="change">Thay đổi bài tập ngày này</option>
              </select>
            </div>

            {editAction === "swap" ? (
              <div className="form-group">
                <label>ĐỔI VỚI THỨ:</label>
                <select value={swapTargetDay} onChange={(e) => setSwapTargetDay(e.target.value)}>
                  {daysOfWeek.filter(d => d !== editDayKey).map(d => (
                    <option key={d} value={d}>{vnDayNames[d]}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="form-group">
                <label>CHỌN BÀI TẬP MỚI:</label>
                <select value={newWorkoutType} onChange={(e) => setNewWorkoutType(e.target.value)}>
                  <option value="Run_Easy">Chạy bộ (Easy Run - Chạy nhẹ)</option>
                  <option value="Run_Interval">Chạy bộ (Intervals - Chạy nhanh)</option>
                  <option value="Run_Tempo">Chạy bộ (Tempo - Tốc độ)</option>
                  <option value="Run_Long">Chạy bộ (Long Run - Chạy dài)</option>
                  <option value="Swim">Bơi lội (Swim - Thể lực nước)</option>
                  <option value="Pickleball">Pickleball (Cross-training di chuyển)</option>
                  <option value="Workout">Workout (Toàn thân bổ trợ lực)</option>
                  <option value="Rest">Nghỉ ngơi dưỡng phục</option>
                </select>
              </div>
            )}

            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Hủy</button>
              <button className="btn-complete" style={{ padding: "10px" }} onClick={handleApplyAdjustment}>Áp dụng thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Goals / Edit Goals Modal */}
      {showOnboarding && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleOnboardingSubmit}>
            <h3>{isOnboardingMode ? "Thiết lập thông số giáo án" : "Chỉnh sửa thông số mục tiêu"}</h3>
            
            <div className="form-group">
              <label>HỌ VÀ TÊN HIỂN THỊ</label>
              <input 
                type="text" 
                required
                placeholder="Ví dụ: Vương Quốc" 
                value={onboardingProfile.displayName} 
                onChange={(e) => setOnboardingProfile({ ...onboardingProfile, displayName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>CÁC MÔN THỂ THAO TẬP LUYỆN</label>
              <div className="sports-checkbox-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "8px" }}>
                {[
                  { id: "run", label: "🏃 Chạy bộ (Running)" },
                  { id: "swim", label: "🏊 Bơi lội (Swimming)" },
                  { id: "pickleball", label: "🏓 Pickleball" },
                  { id: "cycle", label: "🚴 Đạp xe (Cycling)" }
                ].map(sport => {
                  const checked = onboardingProfile.sports?.includes(sport.id) || false;
                  return (
                    <label 
                      key={sport.id} 
                      className={`sport-checkbox-card ${checked ? "active" : ""}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "8px",
                        border: checked ? "1px solid var(--accent-color)" : "1px solid #2d3748",
                        background: checked ? "rgba(16, 185, 129, 0.1)" : "rgba(25, 33, 50, 0.5)",
                        cursor: "pointer",
                        userSelect: "none"
                      }}
                    >
                      <input 
                        type="checkbox"
                        checked={checked}
                        style={{ marginRight: "8px", accentColor: "var(--accent-color)" }}
                        onChange={(e) => {
                          let newSports = [...(onboardingProfile.sports || [])];
                          if (e.target.checked) {
                            newSports.push(sport.id);
                          } else {
                            newSports = newSports.filter(s => s !== sport.id);
                          }
                          setOnboardingProfile({ ...onboardingProfile, sports: newSports });
                        }}
                      />
                      <span>{sport.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
 
            <div className="form-group">
              <label>CÂN NẶNG HIỆN TẠI (KG)</label>
              <input 
                type="number" 
                step="0.1" 
                required
                value={onboardingProfile.weight} 
                onChange={(e) => setOnboardingProfile({ ...onboardingProfile, weight: e.target.value })}
              />
            </div>
 
            <div className="form-group">
              <label>CÂN NẶNG MỤC TIÊU (KG)</label>
              <input 
                type="number" 
                step="0.1" 
                required
                value={onboardingProfile.targetWeight} 
                onChange={(e) => setOnboardingProfile({ ...onboardingProfile, targetWeight: e.target.value })}
              />
            </div>
 
            <div className="form-group">
              <label>PACE CHẠY MỤC TIÊU (VÍ DỤ: 4:30)</label>
              <input 
                type="text" 
                required
                placeholder="Ví dụ: 4:30" 
                value={onboardingProfile.targetPace} 
                onChange={(e) => setOnboardingProfile({ ...onboardingProfile, targetPace: e.target.value })}
              />
            </div>

            {!isOnboardingMode && (
              <div className="form-group" style={{ marginTop: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontWeight: "normal", fontSize: "14px", color: "var(--text-secondary)" }}>
                  <input 
                    type="checkbox"
                    checked={recreateScheduleOnSubmit}
                    onChange={(e) => setRecreateScheduleOnSubmit(e.target.checked)}
                    style={{ marginRight: "8px", accentColor: "var(--accent-color)" }}
                  />
                  Tạo lại giáo án 8 tuần mới theo cấu hình này (xóa bài tập cũ)
                </label>
              </div>
            )}
 
            <div className="modal-buttons" style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
              {!isOnboardingMode && (
                <button type="button" className="btn-cancel" style={{ flex: 1 }} onClick={() => setShowOnboarding(false)}>
                  Hủy
                </button>
              )}
              <button type="submit" className="btn-complete" style={{ flex: 2, padding: "12px" }}>
                Xác nhận và lưu mục tiêu
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
