import { create } from 'zustand';

export const usePersonalScheduleStore = create((set) => ({
  schedules: [
    {
      id: 1,
      title: '헬스장',
      startDate: '2026.06.12 (금)',
      endDate: '2026.06.12 (금)',
      time: '07:00 - 08:00',
      location: '',
      category: 'SelfDevelopment',
      alarmTime: '30분 전',
      repeat: {
        type: 'daily',
        interval: 3,
        until: '2026.06.30 (화)',},
    },
    {
      id: 2,
      title: 'tave 회의',
      startDate: '2026.06.06 (토)',
      endDate: '2026.06.06 (토)',
      time: '15:00 - 17:00',
      location: '',
      category: 'TeamProject',
      alarmTime: '30분 전',
      repeat: {
        type: 'weekly',
        interval: 1,
        until: '2026.06.27 (토)',
      },
    },
    {
      id: 3,
      title: '학원 알바',
      startDate: '2026.06.01 (월)',
      endDate: '2026.06.01 (월)',
      time: '19:00 - 21:00',
      location: '',
      category: 'Work',
      alarmTime: '30분 전',
      repeat: {
        type: 'weekly',
        interval: 1,
        until: '2026.06.29 (월)',
      },
    },
    {
      id: 4,
      title: '시스템 프로그래밍 보강',
      startDate: '2026.06.08 (월)',
      endDate: '2026.06.08 (월)',
      time: '14:00 - 16:00',
      location: '',
      category: 'Class',
      alarmTime: '30분 전',
      repeat: null,
    },
    {
      id: 5,
      title: '치과 정기검진',
      startDate: '2026.06.08 (월)',
      endDate: '2026.06.08 (월)',
      time: '17:00 - 18:00',
      location: '',
      category: 'Other',
      alarmTime: '30분 전',
      repeat: {
        type: 'monthly',
        interval: 4,
        until: '2026.12.08 (일)',
      }
    },
    {
      id: 6,
      title: '할머니 연락',
      startDate: '2026.06.08 (월)',
      endDate: '2026.06.08 (월)',
      time: '13:00 - 13:30',
      location: '',
      category: 'Family',
      alarmTime: '30분 전',
      repeat: {
        type: 'monthly',
        interval: 4,
        until: '2026.12.08 (일)',
      }
    },
    {
      id: 7,
      title: '부산 여행',
      startDate: '2026.06.27 (토)',
      endDate: '2026.06.28 (일)',
      time: '19:00 - 24:00',
      location: '',
      category: 'Leisure',
      alarmTime: '30분 전',
      repeat: null,
    },
  ],

  addSchedule: (newSchedule) =>
    set((state) => ({
      schedules: [
        ...state.schedules,
        {
          id: Date.now(),
          repeat: null,
          ...newSchedule,
        },
      ],
    })),

  deleteSchedule: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.filter((schedule) => schedule.id !== scheduleId),
    })),

  updateSchedule: (scheduleId, updatedFields) =>
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? { ...schedule, ...updatedFields }
          : schedule
      ),
    })),
}));