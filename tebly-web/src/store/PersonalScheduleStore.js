import { create } from 'zustand';
import apiClient from '../api/client';

const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

export const ALARM_TO_MINUTES = { '5분 전': 5, '10분 전': 10, '30분 전': 30, '1시간 전': 60, '12시간 전': 720, '1일 전': 1440 };
export const MINUTES_TO_ALARM = Object.fromEntries(
  Object.entries(ALARM_TO_MINUTES).map(([label, minutes]) => [minutes, label])
);

function toKoreanDateStr(isoDateTime) {
  const d = new Date(isoDateTime);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day} (${DAY_KO[d.getDay()]})`;
}

function toTimeStr(isoDateTime) {
  const d = new Date(isoDateTime);
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}

function mapEventDto(event) {
  return {
    id: event.eventId,
    sourceType: 'PERSONAL',
    // 반복 일정 단일 회차 삭제(DELETE /schedules/events/{id}/occurrences)에 필요한 원본 값
    occurrenceStart: event.startAt,
    occurrenceEnd: event.endAt,
    repeatType: event.repeatType,
    title: event.title,
    startDate: toKoreanDateStr(event.startAt),
    endDate: toKoreanDateStr(event.endAt),
    time: `${toTimeStr(event.startAt)} - ${toTimeStr(event.endAt)}`,
    location: event.location || '',
    memo: event.memo || '',
    // 카테고리는 실제 백엔드 객체({categoryId, categoryName, categoryIcon})를 그대로 들고 있음
    category: event.category,
    alarmTime: (event.notificationLeadMinutes || [])
      .map((minutes) => MINUTES_TO_ALARM[minutes])
      .filter(Boolean)
      .join(', '),
    repeat: event.repeatType && event.repeatType !== 'NONE'
      ? { type: event.repeatType.toLowerCase(), interval: 1, until: event.repeatUntil ? toKoreanDateStr(event.repeatUntil) : null }
      : null,
  };
}

export const usePersonalScheduleStore = create((set) => ({
  schedules: [],

  fetchSchedules: async (view, date) => {
    const res = await apiClient.get('/schedules', { params: { view, date } });
    set({ schedules: res.data.events.map(mapEventDto) });
  },
}));
