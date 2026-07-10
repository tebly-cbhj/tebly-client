import { create } from 'zustand';

export const useOCRScheduleStore = create((set) => ({
  schedules: [],
  updateSchedule: (id, updatedFields) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, ...updatedFields } : s
      ),
    })),
  setSchedules: (schedules) => set({ schedules }),
}));
