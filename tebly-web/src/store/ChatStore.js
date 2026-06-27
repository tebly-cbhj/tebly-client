import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useChatStore = create((set, get) => ({
  client: null,
  isConnected: false,
  messagesByRoom: {},

  // 연결 시작
  connect: (roomId, accessToken) => {   // ← 이 줄 빠진 거야!
    const existingClient = get().client;
    if (existingClient?.connected || existingClient?.active) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL),
      connectHeaders: {
        Authorization: 'Bearer ' + accessToken,
      },
      onConnect: () => {
        set({ isConnected: true });

        const MY_SENDER_ID = 6; // TODO: 로그인 후 실제 userId로 교체

        client.subscribe(`/topic/chat/room/${roomId}`, (message) => {
          const body = JSON.parse(message.body);
          const newMessages = Array.isArray(body) ? body : [body];

          set((state) => ({
            messagesByRoom: {
              ...state.messagesByRoom,
              [roomId]: [
                ...(state.messagesByRoom[roomId] ?? []),
                ...newMessages.map((msg) => ({
                  id: msg.id,
                  type: msg.senderId === MY_SENDER_ID ? 'sent' : 'received-shown',
                  senderName: msg.senderNickname,
                  profileImage: msg.senderProfileImageUrl,
                  text: msg.content,
                  sentAt: msg.sentAt,
                })),
              ],
            },
          }));
        });
      },
      onDisconnect: () => set({ isConnected: false }),
      onStompError: (frame) => console.error('STOMP 에러', frame),
    });

    client.activate();
    set({ client });
  },

  // 메시지 보내기
  sendMessage: (roomId, content) => {
    const { client } = get();
    if (!client?.connected) return;
    client.publish({
      destination: '/app/chat/send',
      body: JSON.stringify({ roomId: Number(roomId), content }),
    });
  },

  // 앱 종료 시 연결 끊기
  disconnect: () => {
    get().client?.deactivate();
    set({ client: null, isConnected: false });
  },
}));