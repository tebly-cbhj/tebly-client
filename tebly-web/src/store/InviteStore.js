import { create } from 'zustand';
import { useRoomStore } from './RoomStore';
import { useScheduleStore } from './ScheduleStore';

export const useInviteStore = create((set) => ({
  // TODO: 앱 시작 시 API에서 초대 목록 불러오기
  roomInvites: [
    {
      id: 4,
      roomName: '캘캘캘박',
      description: '테스트용 방',
      inviter: '민채은',
    },
  ],
  appointmentInvites: [
    {
      id: 4,              // 초대장 id
      roomId: 1,          // 방 id (ScheduleStore랑 동일)
      appointmentId: 1,   // 약속 id
      roomName: '캘박하조',
      title: '집에서놀기',  // ScheduleStore랑 동일하게 title로
      date: '2026.06.28 (일)', // ScheduleStore랑 동일한 형식
      time: '18:00 - 20:00',  // ScheduleStore랑 동일한 형식
      location: '집',
      category: 'Appointment',    // ScheduleStore랑 동일하게 category로
    }
  ],

  rejectRoomInvite: (id) =>
    set((state) => ({
      roomInvites: state.roomInvites.filter((invite) => invite.id !== id),
      // TODO: 방 초대 거절 API 연동
    })),

  rejectAppointmentInvite: (id) =>
    set((state) => ({
      appointmentInvites: state.appointmentInvites.filter((invite) => invite.id !== id),
      // TODO: 약속 초대 거절 API 연동
    })),

  acceptRoomInvite: (id) =>
    set((state) => {
      const invite = state.roomInvites.find((i) => i.id === id);

      // RoomStore에 방 추가
      if (invite) {
        useRoomStore.getState().addRoom(
          invite.roomName,
          invite.description,
          [] // TODO: API 연동 후 실제 멤버 목록으로 대체
        );
      }

      return {
        roomInvites: state.roomInvites.filter((i) => i.id !== id),
        // TODO: 방 초대 수락 API 연동
      };
    }),

  acceptAppointmentInvite: (id) =>
  set((state) => {
    const invite = state.appointmentInvites.find((i) => i.id === id);

    if (invite) {
      useScheduleStore.getState().addSchedule(invite.roomId, {
        title: invite.title,
        date: invite.date,
        time: invite.time,
        location: invite.location,
        category: invite.category,
        confirmed: true,
        memberIds: [],    // ✅ 추가 (TODO: API 연동 후 실제 멤버로 대체)
        acceptedIds: [],  // ✅ 추가 (TODO: API 연동 후 실제 수락 멤버로 대체)
        alarmTime: '30분 전', // ✅ 추가 (TODO: API 연동 후 실제 알람 시간으로 대체)
      });
    }

    return {
      appointmentInvites: state.appointmentInvites.filter((i) => i.id !== id),
      // TODO: 약속 초대 수락 API 연동
    };
  }),
}));