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

// 서버가 /schedules 조회 시 반복 일정을 이미 "이 기간에 발생하는 각 회차"로
// startDate가 다른 별개의 row로 펼쳐서 내려준다(같은 이벤트, 다른 날짜). 그래서
// 여기서 schedule.repeat 기준으로 또 반복 확장을 하면 회차별 사본마다 다시 반복
// 계산이 돌아 중복 표시된다 — 각 row는 자신의 startDate 하루에서만 표시한다.
export const expandRepeatingSchedules = (schedules, sunday, saturday) => {
  return schedules
    .filter((schedule) => {
      const start = parseDate(schedule.startDate);
      return start >= sunday && start <= saturday;
    })
    .map((schedule) => ({ ...schedule, _occurrenceDate: parseDate(schedule.startDate) }));
};