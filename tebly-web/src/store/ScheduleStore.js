import { create } from 'zustand';
import apiClient from '../api/client';

export const useScheduleStore = create((set, get) => ({
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
    const nextIsPrivate = !target.isPrivate;
    await apiClient.patch(`/schedules/categories/${categoryId}`, {
      isPrivate: nextIsPrivate,
    });
    // PATCH 응답의 data는 카테고리 객체가 아니라 categoryId(숫자)만 내려와서,
    // 응답을 그대로 넣으면 다른 필드가 다 undefined가 됨 → 로컬에서 직접 병합
    set((state) => ({
      categories: state.categories.map((c) =>
        c.categoryId === categoryId ? { ...c, isPrivate: nextIsPrivate } : c
      ),
    }));
  },

  updateCategory: async (categoryId, updatedCategory) => {
    await apiClient.patch(`/schedules/categories/${categoryId}`, {
      name: updatedCategory.name,
      icon: updatedCategory.iconId,
    });
    // PATCH 응답의 data는 카테고리 객체가 아니라 categoryId(숫자)만 내려와서,
    // 응답을 그대로 넣으면 다른 필드가 다 undefined가 됨 → 로컬에서 직접 병합
    set((state) => ({
      categories: state.categories.map((c) =>
        c.categoryId === categoryId
          ? { ...c, categoryName: updatedCategory.name, categoryIcon: updatedCategory.iconId }
          : c
      ),
    }));
  },
}));