import { create } from 'zustand';
import apiClient from '../api/client';

export const useScheduleStore = create((set, get) => ({
  schedules: [
    {
      id: 1,
      roomId: 1,
      title: '떡볶이 모임',
      date: '2026.05.12 (화)',
      time: '18:00 - 20:00',
      location: '엽기떡볶이 신촌점',
      category: 'Appointment',
      alarmTime: '30분 전',
      memberIds: [1, 2, 3, 4, 5],
      acceptedIds: [1, 2],
      confirmed: true,
      createdByMe: true,
      myStatus: null,
    },
    {
      id: 2,
      roomId: 1,
      title: '카페 모임',
      date: '2026.05.15 (금)',
      time: '14:00 - 16:00',
      location: '스타벅스 강남점',
      category: 'Club',
      alarmTime: '1시간 전',
      memberIds: [1, 2, 3, 4, 5],
      acceptedIds: [1, 2, 3, 4],
      confirmed: true,
      createdByMe: false,
      myStatus: 'accepted',
    },
    {
      id: 3,
      roomId: 2,
      title: '한강 자전거',
      date: '2026.06.16 (화)',
      time: '14:00 - 16:00',
      location: '이촌 한강공원',
      category: 'Leisure',
      alarmTime: '1시간 전',
      memberIds: [2],
      acceptedIds: [2],
      confirmed: true,
      createdByMe: false,
      myStatus: 'pending',
    },
  ],

  categories: [],

  alarmOptions: ['1일 전', '1시간 전', '30분 전', '15분 전'],

  fetchCategories: async () => {
    const res = await apiClient.get('/schedules/categories');
    set({ categories: res.data });
  },

  addCategory: async (newCategory) => {
    const res = await apiClient.post('/schedules/categories', {
      name: newCategory.name,
      icon: newCategory.iconId,
      isPrivate: false,
    });
    // POST 응답이 생성된 카테고리 객체가 아니라 새 categoryId(숫자)만 내려와서,
    // 응답을 그대로 넣으면 이름/아이콘이 undefined가 됨 → 요청 값으로 직접 구성
    const created = {
      categoryId: res.data,
      categoryName: newCategory.name,
      categoryIcon: newCategory.iconId,
      isPrivate: false,
      isDefault: false,
    };
    set((state) => ({ categories: [...state.categories, created] }));
  },

  deleteCategory: async (categoryId) => {
    await apiClient.delete(`/schedules/categories/${categoryId}`);
    set((state) => ({
      categories: state.categories.filter((c) => c.categoryId !== categoryId),
    }));
  },

  togglePrivate: async (categoryId) => {
    const target = get().categories.find((c) => c.categoryId === categoryId);
    if (!target) return;
    const res = await apiClient.patch(`/schedules/categories/${categoryId}`, {
      isPrivate: !target.isPrivate,
    });
    set((state) => ({
      categories: state.categories.map((c) => (c.categoryId === categoryId ? res.data : c)),
    }));
  },

  updateCategory: async (categoryId, updatedCategory) => {
    const res = await apiClient.patch(`/schedules/categories/${categoryId}`, {
      name: updatedCategory.name,
      icon: updatedCategory.iconId,
    });
    set((state) => ({
      categories: state.categories.map((c) => (c.categoryId === categoryId ? res.data : c)),
    }));
  },

  addSchedule: (roomId, newSchedule) =>
    set((state) => ({
      schedules: [
        ...state.schedules,
        { id: Date.now(), roomId, ...newSchedule },
      ],
    })),

  deleteSchedule: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== scheduleId),
    })),

  confirmSchedule: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === scheduleId ? { ...s, confirmed: true } : s
      ),
    })),
}));