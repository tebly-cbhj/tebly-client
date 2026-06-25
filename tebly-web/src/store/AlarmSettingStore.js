import { create } from 'zustand';

export const useAlarmSettingStore = create((set) => ({
  scheduleRemindAlarm: false,   // 일정 리마인드 알림
  pokingAlarm: false,           // 콕 찌르기 알림
  roomInviteAlarm: false,       // 방 초대장 알림
  appointmentInviteAlarm: false, // 약속 초대장 알림

  // TODO: 앱 시작 시 API에서 알림 설정 불러와서 초기값 세팅
  // initAlarmSettings: (settings) => set(settings),

  toggleScheduleRemindAlarm: () => set((state) => ({ scheduleRemindAlarm: !state.scheduleRemindAlarm })),
  togglePokingAlarm: () => set((state) => ({ pokingAlarm: !state.pokingAlarm })),
  toggleRoomInviteAlarm: () => set((state) => ({ roomInviteAlarm: !state.roomInviteAlarm })),
  toggleAppointmentInviteAlarm: () => set((state) => ({ appointmentInviteAlarm: !state.appointmentInviteAlarm })),
}));