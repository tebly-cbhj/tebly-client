import { create } from 'zustand';

function getToday() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

// CalendarPage는 '/calendar/create', '/calendar/event-detail' 등 별도 라우트로
// 이동했다가 돌아올 때마다 리마운트되므로, viewMode/selectedDate를
// 컴포넌트 로컬 상태가 아닌 스토어에 둬서 리마운트에도 유지되게 함.
export const useCalendarViewStore = create((set) => ({
  viewMode: 'month',
  selectedDate: getToday(),

  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
}));
