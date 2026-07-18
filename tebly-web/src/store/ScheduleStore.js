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

// RoomPromiseResponse엔 카테고리가 myCategoryId(id)로만 내려오고 전체 카테고리 객체가
// 없어서, 화면에서 categories 목록으로 직접 찾아 써야 함(category는 못 찾을 때의 fallback)
function mapPromiseToSchedule(promise, roomId) {
  return {
    id: promise.promiseId,
    sourceType: 'PROMISE',
    roomId,
    title: promise.title,
    date: toKoreanDateStr(promise.startTime),
    time: `${toTimeStr(promise.startTime)} - ${toTimeStr(promise.endTime)}`,
    location: promise.location || '',
    categoryId: promise.myCategoryId,
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

    // promiseId를 문자열로 정규화해서 방 단위가 아니라 전체 기준으로 중복 제거한다.
    // (myPromises/invitedPromises가 같은 방 안에서도 겹칠 수 있고, 드물게 promiseId가
    // 숫자/문자열로 섞여 내려오는 경우가 있어서 Set 비교가 실패해 중복이 남을 수 있었음)
    const seen = new Set();
    const schedules = roomDetails.flatMap(({ roomId, detail }) => {
      const promises = [...(detail.myPromises || []), ...(detail.invitedPromises || [])];
      return promises
        .filter((p) => {
          const key = String(p.promiseId);
          // 확정된 약속이라도 내가 참석(ACCEPTED)으로 응답한 것만 캘린더에 보여줘야 함
          // (미응답/불참인데도 뜨는 버그가 있었음)
          if (p.promiseStatus !== 'CONFIRMED' || p.myStatus !== 'ACCEPTED' || seen.has(key)) return false;
          seen.add(key);
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