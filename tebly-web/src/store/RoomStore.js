import { create } from 'zustand';
import apiClient from '../api/client';

export const useRoomStore = create((set) => ({
  rooms: [],
  roomDetail: null,

  fetchRooms: async () => {
    const res = await apiClient.get('/rooms');
    set({ rooms: res.data });
  },

  fetchRoomDetail: async (roomId) => {
    const res = await apiClient.get(`/rooms/${roomId}`);
    set({ roomDetail: res.data });
  },

  uploadRoomImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/rooms/image', formData);
    return res.data.roomImageUrl;
  },

  addRoom: (newTitle, newDesc, members) => set((state) => ({
    rooms: [
      ...state.rooms,
      { id: Date.now(), title: newTitle, description: newDesc, members }
    ]
  })),

  updateRoomMembers: (roomId, newMembers) => set((state) => ({
    rooms: state.rooms.map((room) => 
      room.id === roomId 
        ? { ...room, members: newMembers }
        : room
    )
  }))
}));