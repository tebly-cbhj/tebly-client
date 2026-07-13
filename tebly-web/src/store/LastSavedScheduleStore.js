import { create } from 'zustand';

// CreateSchedulePage에서 일정을 수정하고 나면, navigate(-1)로 돌아가는
// EventDetailPage는 location.state(수정 전 값)를 그대로 쓰기 때문에
// 화면에 변경 사항이 반영되지 않음. 히스토리 스택을 건드리지 않고
// 방금 저장한 값만 별도로 전달하기 위한 스토어.
export const useLastSavedScheduleStore = create((set) => ({
  scheduleId: null,
  schedule: null,

  setLastSaved: (scheduleId, schedule) => set({ scheduleId, schedule }),
  clearLastSaved: () => set({ scheduleId: null, schedule: null }),
}));
