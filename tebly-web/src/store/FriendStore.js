import { create } from 'zustand';

export const useFriendStore = create((set) => ({
  friends: [
    { id: 1, name: '김돌리', profileImage: null },
    { id: 2, name: '최또치', profileImage: null },
    { id: 3, name: '고길동', profileImage: null },
    { id: 4, name: '희동이', profileImage: null },
    { id: 5, name: '마이쿨', profileImage: null },
  ],

  // 💡 (미래를 위한 세팅) 나중에 진짜 API가 나오면 쓸 함수
  fetchFriends: async () => {
    // const response = await fetch('/api/friends');
    // const data = await response.json();
    // set({ friends: data });
  }
}));