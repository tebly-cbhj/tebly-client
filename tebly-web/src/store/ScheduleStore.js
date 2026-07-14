import { create } from 'zustand';
import apiClient from '../api/client';

const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

function toKoreanDateStr(isoDateTime) {
  const d = new Date(isoDateTime);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day} (${DAY_KO[d.getDay()]})`;
}

function toTimeStr(isoDateTime) {
  const d = new Date(isoDateTime);
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}

// 방 약속 목록 API(RoomPromiseResponse)엔 카테고리 정보가 없어서 비워둠(Other로 표시됨)
function mapPromiseToSchedule(promise, roomId) {
  return {
    id: promise.promiseId,
    roomId,
    title: promise.title,
    date: toKoreanDateStr(promise.startTime),
    time: `${toTimeStr(promise.startTime)} - ${toTimeStr(promise.endTime)}`,
    location: promise.location || '',
    category: 'Other',
    alarmTime: '',
    memo: '',
    repeat: null,
    confirmed: promise.promiseStatus === 'CONFIRMED',
    createdByMe: promise.isSender,
    myStatus: promise.myStatus,
  };
}

export const useScheduleStore = create((set, get) => ({
  schedules: [],

  categories: [],

  alarmOptions: ['1일 전', '1시간 전', '30분 전', '15분 전'],

  // 캘린더에 뜨는 "확정된 방 약속" — 방 목록 전체를 돌면서 각 방의 약속을 모아옴
  // (약속 전체를 한번에 주는 API가 없어서 방 개수만큼 요청이 나감)
  fetchConfirmedSchedules: async () => {
    const roomsRes = await apiClient.get('/rooms');
    const roomDetails = await Promise.all(
      roomsRes.data.map((room) =>
        apiClient.get(`/rooms/${room.roomId}`).then((res) => ({ roomId: room.roomId, detail: res.data }))
      )
    );

    const schedules = roomDetails.flatMap(({ roomId, detail }) => {
      const promises = [...(detail.myPromises || []), ...(detail.invitedPromises || [])];
      const seen = new Set();
      return promises
        .filter((p) => {
          if (p.promiseStatus !== 'CONFIRMED' || seen.has(p.promiseId)) return false;
          seen.add(p.promiseId);
          return true;
        })
        .map((p) => mapPromiseToSchedule(p, roomId));
    });

    set({ schedules });
  },

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