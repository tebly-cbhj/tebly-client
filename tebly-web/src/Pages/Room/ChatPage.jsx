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
import MemberIcon from '../../assets/icons/member.svg?react';
import ChevronDownIcon from '../../assets/icons/chevron-down.svg?react';

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

const NoticeCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 20px;
  margin: 0.5rem 1.25rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.bg};
  box-sizing: border-box;
  flex-shrink: 0;
  cursor: pointer;
`;

const NoticeHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;

const NoticeTitle = styled.span`
  flex: 1;
  min-width: 0;
  ${({ theme }) => theme.typography.s2};
  color: ${({ theme }) => theme.colors.gray900};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NoticeToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const NoticeDetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
`;

const NoticeDate = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray800};
`;

const NoticeInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const NoticeLocation = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray800};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NoticeMemberCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const NoticeMemberCountText = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray800};
`;

function formatShortDateLabel(isoDateTime) {
  const d = new Date(isoDateTime);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

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

const CalendarIcon = ({ color = '#1A1A1A' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M3 10H21V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10Z" stroke={color} strokeWidth="2" />
    <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V10H3V7Z" stroke={color} strokeWidth="2" />
    <path d="M8 3V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="7.5" y="13.5" width="1" height="1" rx="0.5" fill={color} stroke={color} />
    <rect x="11.5" y="13.5" width="1" height="1" rx="0.5" fill={color} stroke={color} />
    <rect x="15.5" y="13.5" width="1" height="1" rx="0.5" fill={color} stroke={color} />
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
  const [isNoticeExpanded, setIsNoticeExpanded] = useState(true);
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
        <NoticeCard
          onClick={() =>
            navigate('/my-appointments', {
              state: { promiseId: confirmedPromise.promiseId, roomId: Number(roomId) },
            })
          }
        >
          <NoticeHeaderRow>
            <CalendarIcon color={isNoticeExpanded ? '#1A1A1A' : '#34BAA0'} />
            <NoticeTitle>{confirmedPromise.title}</NoticeTitle>
            <NoticeToggleButton
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsNoticeExpanded((prev) => !prev);
              }}
            >
              <ChevronDownIcon
                style={{ transform: isNoticeExpanded ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
              />
            </NoticeToggleButton>
          </NoticeHeaderRow>

          {isNoticeExpanded && (
            <NoticeDetailGroup>
              <NoticeDate>{formatShortDateLabel(confirmedPromise.startTime)}</NoticeDate>

              <NoticeInfoRow>
                <NoticeLocation>{confirmedPromise.location}</NoticeLocation>
                <NoticeMemberCount>
                  <MemberIcon />
                  <NoticeMemberCountText>
                    {confirmedPromise.acceptedCount}/{confirmedPromise.totalMemberCount}
                  </NoticeMemberCountText>
                </NoticeMemberCount>
              </NoticeInfoRow>
            </NoticeDetailGroup>
          )}
        </NoticeCard>
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