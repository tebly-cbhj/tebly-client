// src/utils/dateUtils.js

// '2026.06.12 (금)' → Date 객체로 변환
export const parseDate = (dateStr) => {
  const cleaned = dateStr.split(' ')[0].replace(/\./g, '-');
  return new Date(cleaned);
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
  sunday.setDate(baseDate.getDate() - baseDate.getDay());

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