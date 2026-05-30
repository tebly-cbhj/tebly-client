import { create } from 'zustand';

export const useRoomStore = create((set) => ({
  rooms: [
    { 
      id: 1, 
      title: '캘박하조', 
      description: '화이팅', 
      members: [
        { id: 1, name: '김돌리', profileImage: null },
        { id: 2, name: '최또치', profileImage: null },
      ] 
    },
    { 
      id: 2, 
      title: '회의하조', 
      description: '매주 토요일 사당역에서', 
      members: [
        { id: 2, name: '최또치', profileImage: null },
      ] 
    },
    { 
      id: 3, 
      title: '집에가조', 
      description: '회의가 끝난 이후에', 
      members: [
        { id: 3, name: '고길동', profileImage: null }
      ] 
    },
  ],

  // 새로운 방을 추가 함수
  addRoom: (newTitle, newDesc, members) => set((state) => ({
    rooms: [
      ...state.rooms,
      { id: Date.now(), title: newTitle, description: newDesc, members }
    ]
  })),

  // 기존 방의 친구 목록을 업데이트하는 함수
  updateRoomMembers: (roomId, newMembers) => set((state) => ({
    rooms: state.rooms.map((room) => 
      room.id === roomId 
        ? { ...room, members: newMembers } // 아이디가 일치하면 새로운 멤버 목록으로 덮어씌움
        : room                             // 일치하지 않으면 그대로 둠
    )
  }))
}));