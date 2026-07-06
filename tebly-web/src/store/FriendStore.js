import { create } from 'zustand';
import apiClient from '../api/client';

export const useFriendStore = create((set) => ({
  myProfile: null,
  inviteCode: null,

  fetchMyProfile: async () => {
    const res = await apiClient.get('/users/me');
    set({ myProfile: res.data });
  },

  fetchInviteCode: async () => {
    const res = await apiClient.get('/users/me/invite-code');
    set({ inviteCode: res.data });
  },

  updateMyProfile: async ({ nickname, profileImageUrl }) => {
    const res = await apiClient.patch('/users/me', { nickname, profileImageUrl });
    set({ myProfile: res.data });
  },

  // TODO: GET /api/friends — 친구 목록 API 연동 후 교체 (fetchFriends 호출로 초기화)
  friends: [
    { id: 1, name: '조정묵', intro: '엽덕 개땡기네', profileImage: null, isFavorite: true },
    { id: 2, name: '정지윤', intro: '점심 뭐 먹지', profileImage: null, isFavorite: true },
    { id: 3, name: '김동욱', intro: '아 졸리다', profileImage: null, isFavorite: false },
    { id: 4, name: '김민정', intro: '', profileImage: null, isFavorite: false },
    { id: 5, name: '김성은', intro: '근데 불닭도 먹고 싶고', profileImage: null, isFavorite: false },
    { id: 6, name: '박서현', intro: '', profileImage: null, isFavorite: false },
    { id: 7, name: '손민정', intro: '', profileImage: null, isFavorite: false },
    { id: 8, name: '이수진', intro: '', profileImage: null, isFavorite: false },
    { id: 9, name: '최준혁', intro: '', profileImage: null, isFavorite: false },
    { id: 10, name: '한지원', intro: '', profileImage: null, isFavorite: false },
  ],

  toggleFavorite: (id) =>
    set((state) => ({
      friends: state.friends.map((f) =>
        f.id === id ? { ...f, isFavorite: !f.isFavorite } : f
      ),
    })),

  deleteFriend: (id) =>
    set((state) => ({
      friends: state.friends.filter((f) => f.id !== id),
    })),

  addFriend: (friend) =>
    set((state) => {
      if (state.friends.some((f) => f.id === friend.id)) return state;
      return { friends: [...state.friends, { ...friend, isFavorite: false }] };
    }),

  fetchFriends: async () => {
    // const response = await fetch('/api/friends');
    // const data = await response.json();
    // set({ friends: data });
  },
}));