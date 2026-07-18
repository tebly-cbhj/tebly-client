import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../../components/common/Header';
import MessageBubble from '../../components/room/MessageBubble';
import MessageInput from '../../components/room/MessageInput';
import DecisionBanner from '../../components/room/DecisionBanner';
import DecisionCard from '../../components/room/DecisionCard';
import { useRoomStore } from '../../store/RoomStore';
import { useChatStore } from '../../store/ChatStore';
import { useFriendStore } from '../../store/FriendStore';

const ChatContainer = styled.div`
  width: 100%;
  max-width: 390px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: var(--grayscale-white, #FEFEFE);
  box-sizing: border-box;
  position: relative;
`;

const AppointmentBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #effffb;
  border-radius: 0.5rem;
  margin: 0.5rem 1.25rem;
  flex-shrink: 0;
`;

const BannerText = styled.span`
  font-family: 'Pretendard Variable', sans-serif;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #525252;
  line-height: 1.4;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 1.25rem;
  padding-bottom: 5.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InputBar = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  background: #fefefe;
  padding: 1rem 1.25rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 0.5px solid #dcdcdc;
  flex-shrink: 0;
`;

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M3 10H21V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10Z" stroke="#34BAA0" strokeWidth="2" />
    <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V10H3V7Z" stroke="#34BAA0" strokeWidth="2" />
    <path d="M8 3V7" stroke="#34BAA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3V7" stroke="#34BAA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14.7143L9.86667 17L15 13" stroke="#34BAA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ChatPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const room = useRoomStore((state) => state.rooms.find((r) => r.id === Number(roomId)));
  const roomDetail = useRoomStore((state) => state.roomDetail);
  const fetchRoomDetail = useRoomStore((state) => state.fetchRoomDetail);
  const { connect, sendMessage, fetchMessages, messagesByRoom } = useChatStore();
  const myProfile = useFriendStore((state) => state.myProfile);
  const fetchMyProfile = useFriendStore((state) => state.fetchMyProfile);
  const messages = messagesByRoom[roomId] ?? [];
  const accessToken = localStorage.getItem('accessToken') || import.meta.env.VITE_ACCESS_TOKEN;

  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!myProfile) fetchMyProfile();
  }, [myProfile, fetchMyProfile]);

  useEffect(() => {
    fetchRoomDetail(Number(roomId));
  }, [roomId, fetchRoomDetail]);

  // 방장이 '약속 확정'을 누른 시점부터 약속 날짜(endTime)까지만 배너 노출
  const confirmedPromise = useMemo(() => {
    if (!roomDetail) return null;
    const promises = [...(roomDetail.myPromises ?? []), ...(roomDetail.invitedPromises ?? [])];
    const now = new Date();
    return promises.find((p) => p.promiseStatus === 'CONFIRMED' && new Date(p.endTime) >= now) ?? null;
  }, [roomDetail]);

  useEffect(() => {
    if (!myProfile) return;
    fetchMessages(roomId, myProfile.id);
    // ✅ accessToken 없으면 연결 시도 안 함
    if (!accessToken) return;
    connect(roomId, accessToken, myProfile.id);
  }, [roomId, myProfile, accessToken]);

  // 방에 들어오면(첫 메시지 로딩)/새 메시지가 오면 항상 맨 아래(최신 메시지)로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(roomId, inputValue.trim());
    setInputValue('');
  };

  return (
    <ChatContainer>
      <HeaderWrapper>
        <Header
          title={room?.title ?? '채팅'}
          leftIcon="back"
          onLeft={() => navigate(`/room/${roomId}`)}
        />
      </HeaderWrapper>

      {confirmedPromise && (
        <AppointmentBanner>
          <CalendarIcon />
          <BannerText>{confirmedPromise.title} 약속이 확정됐어요 !</BannerText>
        </AppointmentBanner>
      )}

      <MessageList>
        {messages.map((msg) =>
          msg.text?.includes('결정이가 약속 초대장을 전달했어요') ? (
            <div key={msg.id}>
              <DecisionBanner />
              <DecisionCard content={msg.text} />
            </div>
          ) : (
            <MessageBubble
              key={msg.id}
              type={msg.type}
              senderName={msg.senderName}
              text={msg.text}
              profileImage={msg.profileImage}
            />
          )
        )}
        <div ref={bottomRef} />
      </MessageList>

      <InputBar>
        <MessageInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSend={handleSend}
        />
      </InputBar>
    </ChatContainer>
  );
}