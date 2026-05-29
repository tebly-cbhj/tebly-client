import { create } from 'zustand';

export const useScheduleStore = create((set) => ({
  schedules: [
    {
      id: 1,
      title: '떡볶이 모임',
      date: '2026.05.12 (화)',
      location: '엽기떡볶이 신촌점',
      acceptedCount: 4,
      totalCount: 6
    },
    {
      id: 2,
      title: '카페 모임',
      date: '2026.05.15 (금)',
      location: '스타벅스 강남점',
      acceptedCount: 2,
      totalCount: 5
    },
  ],

  addSchedule: (newSchedule) => set((state) => ({
    schedules: [...state.schedules, { id: Date.now(), ...newSchedule }]
  }))
}));