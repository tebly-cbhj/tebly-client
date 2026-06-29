import { create } from 'zustand';

export const useRoomStore = create((set) => ({
  // TODO: GET /api/rooms — 방 목록 API 연동 후 교체
  // 멤버 이름이 FriendStore 더미와 다르지만 API 연동 시 실제 유저 데이터로 대체되므로 수정 불필요
  rooms: [
    { 
      id: 1, 
      title: '캘박하조', 
      description: '화이팅', 
      members: [
        { id: 1, name: '김돌리', profileImage: null },
        { id: 2, name: '최또치', profileImage: null },
        { id: 3, name: '고길동', profileImage: null },
        { id: 4, name: '희동이', profileImage: null },
        { id: 5, name: '마이쿨', profileImage: null },
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

  // 새로운 방을 추가하는 함수
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