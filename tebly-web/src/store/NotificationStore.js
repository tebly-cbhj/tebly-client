import { create } from 'zustand';
import apiClient from '../api/client';

export const useNotificationStore = create((set) => ({
  notifications: [],

  fetchNotifications: async () => {
    const res = await apiClient.get('/notifications/common');
    set({ notifications: res.data });
  },

  markAsRead: async (id) => {
    await apiClient.patch(`/notifications/common/${id}/read`);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  },
}));
