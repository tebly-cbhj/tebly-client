import { create } from 'zustand';

export const useOCRScheduleStore = create((set) => ({
  schedules: [
    {
      id: 1, title: '심리학의 이해', memo: '', category: 'Class', allDay: false,
      startDate: null, endDate: null, startTime: '09:30', endTime: '12:15',
      place: '', alarmTime: '', repeat: '없음',
      time: '목요일 9:30~12:15',
    },
    {
      id: 2, title: '인지 심리학', memo: '', category: 'Class', allDay: false,
      startDate: null, endDate: null, startTime: '11:00', endTime: '12:15',
      place: '', alarmTime: '', repeat: '없음',
      time: '화요일 11:00~12:15, 목요일 9:30~10:45',
    },
    {
      id: 3, title: '발달 심리학', memo: '', category: 'Class', allDay: false,
      startDate: null, endDate: null, startTime: '09:30', endTime: '12:15',
      place: '', alarmTime: '', repeat: '없음',
      time: '수요일 9:30~12:15',
    },
    {
      id: 4, title: '지각 심리학', memo: '', category: 'Class', allDay: false,
      startDate: null, endDate: null, startTime: '09:30', endTime: '12:15',
      place: '', alarmTime: '', repeat: '없음',
      time: '수요일 9:30~12:15',
    },
    {
      id: 5, title: '학원', memo: '', category: 'Other', allDay: false,
      startDate: null, endDate: null, startTime: '09:30', endTime: '12:15',
      place: '', alarmTime: '', repeat: '없음',
      time: '수요일 9:30~12:15',
    },
  ],
  updateSchedule: (id, updatedFields) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, ...updatedFields } : s
      ),
    })),
  setSchedules: (schedules) => set({ schedules }),
}));
