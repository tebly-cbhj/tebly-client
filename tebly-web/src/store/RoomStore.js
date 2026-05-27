import { create } from 'zustand';

export const useRoomStore = create((set) => ({
  // 기본 방 목록 데이터 - 테스트 화면 표시용
  rooms: [
    { id: 1, title: '캘박하조', description: '화이팅', avatars: [null, null, null, null] },
    { id: 2, title: '회의하조', description: '매주 토요일 사당역에서', avatars: [null, null] },
    { id: 3, title: '집에가조', description: '회의가 끝난 이후에', avatars: [null, null, null] },
  ],

  // 2. 새로운 방을 창고에 추가하는 함수
  addRoom: (newTitle, newDesc, avatars) => set((state) => ({
    rooms: [
      ...state.rooms,
      { id: Date.now(), title: newTitle, description: newDesc, avatars }
    ]
  }))
}));