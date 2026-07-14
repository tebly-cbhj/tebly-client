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

  addFriendByCode: async (inviteCode) => {
    await apiClient.post('/friends/requests/code', { inviteCode });
  },

  previewFriendByCode: async (code) => {
    const res = await apiClient.get('/friends/preview', { params: { code } });
    return res.data;
  },

  updateMyProfile: async ({ nickname, profileImageUrl, bio }) => {
    const res = await apiClient.patch('/users/me', { nickname, profileImageUrl, bio });
    set({ myProfile: res.data });
  },

  friends: [],
  friendSchedules: {},

  fetchFriends: async () => {
    const res = await apiClient.get('/friends');
    set({
      friends: res.data.map((f) => ({
        id: f.id,
        name: f.nickname,
        intro: f.bio,
        profileImage: f.profileImageUrl,
        isFavorite: false,
      })),
    });
  },

  // 즐겨찾기는 백엔드 지원 없음 — 로컬 전용, 새로고침/재조회하면 초기화됨
  toggleFavorite: (id) =>
    set((state) => ({
      friends: state.friends.map((f) =>
        f.id === id ? { ...f, isFavorite: !f.isFavorite } : f
      ),
    })),

  deleteFriend: async (id) => {
    await apiClient.delete(`/friends/${id}`);
    set((state) => ({
      friends: state.friends.filter((f) => f.id !== id),
    }));
  },

  fetchFriendSchedules: async (friendId, view, targetDate) => {
    const res = await apiClient.get(`/friends/${friendId}/schedules`, {
      params: { view, targetDate },
    });
    set((state) => ({
      friendSchedules: { ...state.friendSchedules, [friendId]: res.data.events },
    }));
  },
}));