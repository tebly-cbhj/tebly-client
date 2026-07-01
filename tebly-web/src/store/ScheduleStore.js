import { create } from 'zustand';

export const useScheduleStore = create((set) => ({
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
      // TODO: API 연동 시 서버에서 내려오는 createdByMe, myStatus로 교체
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
      myStatus: 'accepted', // 'accepted' | 'rejected' | 'pending'
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

  categories: [
    { name: '약속', iconId: 'Appointment', isPrivate: false, isDefault: true },
    { name: '동아리', iconId: 'Club', isPrivate: false, isDefault: true },
    { name: '가족', iconId: 'Family', isPrivate: false, isDefault: true },
    { name: '자기개발', iconId: 'SelfDevelopment', isPrivate: false, isDefault: true },
    { name: '알바', iconId: 'Work', isPrivate: false, isDefault: true },
    { name: '수업', iconId: 'Class', isPrivate: false, isDefault: true },
    { name: '여가', iconId: 'Leisure', isPrivate: false, isDefault: true },
    { name: '팀 프로젝트', iconId: 'TeamProject', isPrivate: false, isDefault: true },
    { name: '기타', iconId: 'Other', isPrivate: false, isDefault: true },
    { name: '테스트', iconId: 'Class', isPrivate: true, isDefault: false },
  ],

  alarmOptions: ['1일 전', '1시간 전', '30분 전', '15분 전'],

  addSchedule: (roomId, newSchedule) =>
    set((state) => ({
      schedules: [
        ...state.schedules,
        { id: Date.now(), roomId, ...newSchedule },
      ],
    })),

  addCategory: (newCategory) =>
    set((state) => ({
      categories: [
        ...state.categories,
        { ...newCategory, isPrivate: false, isDefault: false }, // TODO: 카테고리 추가 API 연동
      ],
    })),

  deleteCategory: (categoryName) =>
    set((state) => ({
      categories: state.categories.filter(
        (c) => !(c.name === categoryName && !c.isDefault) // isDefault: false인 것만 삭제 가능
      ),
    })),

  togglePrivate: (categoryName) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.name === categoryName ? { ...c, isPrivate: !c.isPrivate } : c
        // TODO: 카테고리 공개/비공개 API 연동
      ),
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
    
  updateCategory: (originalName, updatedCategory) =>
  set((state) => ({
    categories: state.categories.map((c) =>
      c.name === originalName
        ? { ...c, name: updatedCategory.name, iconId: updatedCategory.iconId }
        : c
    ),
  })),
}));