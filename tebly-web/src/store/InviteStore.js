import { create } from 'zustand';
import apiClient from '../api/client';

export const useInviteStore = create((set) => ({
  roomInvites: [],
  appointmentInvites: [],

  fetchInvitations: async () => {
    const res = await apiClient.get('/notifications/invitation');

    const roomInvites = res.data.roomInvitations.map((invite) => ({
      roomId: invite.roomId,
      roomName: invite.roomName,
      description: invite.content,
    }));

    set({ roomInvites, appointmentInvites: res.data.promiseInvitations });
  },

  rejectRoomInvite: async (roomId) => {
    await apiClient.patch(`/rooms/${roomId}/members/me/respond`, { status: 'REJECTED' });
    set((state) => ({
      roomInvites: state.roomInvites.filter((invite) => invite.roomId !== roomId),
    }));
  },

  acceptRoomInvite: async (roomId) => {
    await apiClient.patch(`/rooms/${roomId}/members/me/respond`, { status: 'ACCEPTED' });
    set((state) => ({
      roomInvites: state.roomInvites.filter((invite) => invite.roomId !== roomId),
    }));
  },

  rejectAppointmentInvite: async (promiseId) => {
    await apiClient.patch(`/promises/${promiseId}/invitations/me`, { status: 'REJECTED' });
    set((state) => ({
      appointmentInvites: state.appointmentInvites.filter((invite) => invite.promiseId !== promiseId),
    }));
  },

  acceptAppointmentInvite: async (promiseId) => {
    await apiClient.patch(`/promises/${promiseId}/invitations/me`, { status: 'ACCEPTED' });
    set((state) => ({
      appointmentInvites: state.appointmentInvites.filter((invite) => invite.promiseId !== promiseId),
    }));
  },
}));
