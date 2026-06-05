import { create } from 'zustand';

export const useScheduleStore = create((set) => ({
  schedules: [
    {
      id: 1,
      roomId: 1,
      title: '떡볶이 모임',
      date: '2026.05.12 (화)',
      time: '18:00 - 20:00',
      location: '엽기떡볶이 신촌점',
      category: '약속',
      alarmTime: '30분 전',
      memberIds: [1, 2, 3, 4, 5],
      acceptedIds: [1, 2],
    },
    {
      id: 2,
      roomId: 1,
      title: '카페 모임',
      date: '2026.05.15 (금)',
      time: '14:00 - 16:00',
      location: '스타벅스 강남점',
      category: '동아리',
      alarmTime: '1시간 전',
      memberIds: [1, 2, 3, 4, 5],
      acceptedIds: [1, 2, 3, 4],
    },
  ],

  categories: [
    { name: '약속', iconId: '약속' },
    { name: '동아리', iconId: '동아리' },
    { name: '가족', iconId: '가족' },
    { name: '자기개발', iconId: '자기개발' },
    { name: '알바', iconId: '알바' },
    { name: '수업', iconId: '수업' },
    { name: '여가', iconId: '여가' },
    { name: '팀 프로젝트', iconId: '팀 프로젝트' },
    { name: '기타', iconId: '기타' },
  ],

  alarmOptions: ['1일 전', '1시간 전', '30분 전', '15분 전'],

  addSchedule: (roomId, newSchedule) =>
    set((state) => ({
      schedules: [
        ...state.schedules,
        { id: Date.now(), roomId, ...newSchedule },
      ],
    })),

  addCategory: (newCategory) =>
    set((state) => ({
      categories: [...state.categories, newCategory],
    })),

  deleteSchedule: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== scheduleId),
    })),
}));