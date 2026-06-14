import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../../components/common/Header';
import MessageBubble from '../../components/room/MessageBubble';
import MessageInput from '../../components/room/MessageInput';
import { useRoomStore } from '../../store/RoomStore';

// TODO: WebSocket 연결로 실시간 채팅 구현 필요
// TODO: WebSocket 구현 후 AI 메시지(챗봇 응답) 채팅에 추가 예정 — type: 'received-shown', senderName: 'AI' 형태로 메시지 리스트에 삽입

// TODO: API 연결 시 DUMMY_MESSAGES 제거 후 useState([])로 초기화, 서버에서 받아온 메시지로 대체
const DUMMY_MESSAGES = [
  { id: 1, type: 'received-shown', senderName: '고길동', text: '이번주 어디서 보지?' },
  { id: 2, type: 'received-hidden', text: '추천 ㄱㄱ' },
  { id: 3, type: 'sent', text: '제발 잠실에서 보자' },
  { id: 4, type: 'sent', text: '아님 강남이라도..' },
  { id: 5, type: 'received-shown', senderName: '홍길동', text: '늦으면 오만원' },
  { id: 6, type: 'received-hidden', text: '1분마다 만원 추가' },
  { id: 7, type: 'received-hidden', text: '동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세' },
  { id: 8, type: 'sent', text: '동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세' },
];

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

// 약속 미확정: 민트 배너
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
  font-family: Pretendard, sans-serif;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #525252;
  line-height: 1.4;
`;

// 약속 확정: 회색 카드 (접기/펼치기 가능)
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
  font-family: Pretendard, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #525252;
  line-height: 1.4;
`;

const ChevronIcon = ({ up }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
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
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
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
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  // TODO: API 연결 시 서버에서 받아온 약속 확정 여부(boolean)로 대체
  //   - false: 약속 미확정 → 민트 배너("2차_스터디 약속이 확정됐어요 !") 표시
  //   - true : 약속 확정   → 회색 카드(약속 제목 + 접기/펼치기) 표시
  // TODO: 약속 확정 시 cardExpanded 초기값은 서버 응답 후 true로 설정
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [cardExpanded, setCardExpanded] = useState(true);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: 'sent', text: inputValue.trim() },
    ]);
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

      {/* 약속 미확정: 민트 배너 / 확정: 회색 카드 — appointmentConfirmed 값으로 전환 */}
      {/* 배너/카드 클릭 시 해당 약속 상세/수정 페이지로 이동하도록 연결 필요 */}
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
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            type={msg.type}
            senderName={msg.senderName}
            text={msg.text}
            profileImage={msg.profileImage}
          />
        ))}
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
