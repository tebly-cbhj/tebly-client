// src/utils/dateUtils.js

// '2026.06.12 (금)' → Date 객체로 변환
export const parseDate = (dateStr) => {
  const datePart = dateStr.split(' ')[0];
  const [year, month, day] = datePart.split(/[-.]/).map(Number);
  return new Date(year, month - 1, day);
};

export const parseTime = (timeStr) => {
  const [startStr, endStr] = timeStr.split(' - ');
  const [startH, startM] = startStr.split(':').map(Number);
  const [endH, endM] = endStr.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  return { startMinutes, durationMinutes: endMinutes - startMinutes };
};

// 이번 주 일~토의 날짜 숫자 배열 반환 (WeekDateCell에서 사용)
export const getWeekDates = (baseDate = new Date()) => {
  const sunday = new Date(baseDate);
  sunday.setDate(baseDate.getDate() - baseDate.getDay()); // 일요일로 이동

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d.getDate();
  });
};

// 이번 주 일요일~토요일 범위 반환 (WeekCalendarPage에서 사용)
export const getWeekRange = () => {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  sunday.setHours(0, 0, 0, 0);

  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  saturday.setHours(23, 59, 59, 999);

  return { sunday, saturday };
};

export const expandRepeatingSchedules = (schedules, sunday, saturday) => {
  const result = [];

  for (const schedule of schedules) {
    const start = parseDate(schedule.startDate);
    const until = schedule.repeat?.until ? parseDate(schedule.repeat.until) : null;

    // 반복 없음 → startDate가 이번 주 범위 내인지만 확인
    if (!schedule.repeat) {
      if (start >= sunday && start <= saturday) {
        result.push({ ...schedule, _occurrenceDate: start });
      }
      continue;
    }

    const { type, interval } = schedule.repeat;
    let current = new Date(start);

    while (true) {
      // until 또는 saturday 초과 시 중단
      if (until && current > until) break;
      if (current > saturday) break;

      // 이번 주 범위 내 발생일만 추가
      if (current >= sunday) {
        result.push({
          ...schedule,
          _occurrenceDate: new Date(current),
        });
      }

      // 다음 반복일 계산
      const next = new Date(current);
      if (type === 'daily') {
        next.setDate(next.getDate() + interval);
      } else if (type === 'weekly') {
        next.setDate(next.getDate() + 7 * interval);
      } else if (type === 'monthly') {
        next.setMonth(next.getMonth() + interval);
      } else {
        break; // 알 수 없는 타입은 중단
      }

      // 무한루프 방지: 날짜가 진행되지 않으면 중단
      if (next <= current) break;
      current = next;
    }
  }

  return result;
};