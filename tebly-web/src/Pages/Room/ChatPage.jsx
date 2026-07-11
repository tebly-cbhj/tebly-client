import { useState, useEffect } from 'react';
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
  max-width: 480px;
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

const AppointmentCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #efefef;
  border-radius: 0.75rem;
  margin: 0.5rem 1.25rem;
  flex-shrink: 0;
  cursor: pointer;
`;

const AppointmentCardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AppointmentCardTitle = styled.span`
  font-family: 'Pretendard Variable', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #525252;
  line-height: 1.4;
`;

const ChevronIcon = ({ up }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d={up ? 'M7 15L12 9L17 15' : 'M7 9L12 15L17 9'}
      stroke="#525252"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
  const { connect, sendMessage, fetchMessages, messagesByRoom } = useChatStore();
  const myProfile = useFriendStore((state) => state.myProfile);
  const fetchMyProfile = useFriendStore((state) => state.fetchMyProfile);
  const messages = messagesByRoom[roomId] ?? [];
  const accessToken = localStorage.getItem('accessToken') || import.meta.env.VITE_ACCESS_TOKEN;

  const [inputValue, setInputValue] = useState('');
  // TODO: API 연결 시 서버에서 받아온 약속 확정 여부로 대체
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [cardExpanded, setCardExpanded] = useState(true);

  useEffect(() => {
    if (!myProfile) fetchMyProfile();
  }, [myProfile, fetchMyProfile]);

  useEffect(() => {
    if (!myProfile) return;
    fetchMessages(roomId, myProfile.id);
    // ✅ accessToken 없으면 연결 시도 안 함
    if (!accessToken) return;
    connect(roomId, accessToken, myProfile.id);
  }, [roomId, myProfile, accessToken]);

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
          onLeft={() => navigate(-1)}
        />
      </HeaderWrapper>

      {appointmentConfirmed ? (
        <AppointmentCard onClick={() => setCardExpanded((prev) => !prev)}>
          <AppointmentCardLeft>
            <CalendarIcon />
            <AppointmentCardTitle>캘박하조 1차 스터디</AppointmentCardTitle>
          </AppointmentCardLeft>
          <ChevronIcon up={cardExpanded} />
        </AppointmentCard>
      ) : (
        <AppointmentBanner>
          <CalendarIcon />
          <BannerText>2차_스터디 약속이 확정됐어요 !</BannerText>
        </AppointmentBanner>
      )}

      <MessageList>
        {messages.map((msg) =>
          msg.text?.startsWith('[결정이]') ? (
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