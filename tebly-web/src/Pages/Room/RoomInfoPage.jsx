import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../../store/RoomStore';
import { useFriendStore } from '../../store/FriendStore';
import apiClient from '../../api/client';
import RoomSummarySection from '../../components/room/RoomSummarySection';
import TabBtn from '../../components/common/TabBtn';
import ScheduleCard from '../../components/room/ScheduleCard';
import styled from 'styled-components';
import AddBtn from '../../components/common/AddBtn';
import Header from '../../components/common/Header';
import ActionSheet from '../../components/common/ActionSheet';
import ConfirmPopup from '../../components/common/ConfirmPopup';

// PageWrapper와 같은 max-width/높이/배경이지만, HeaderWrapper가 이미
// 자체적으로 좌우 패딩을 갖고 있어서 패딩은 제외한 버전
const PageContainer = styled.div`
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  height: 100vh;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.bg};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.25rem;
  background: ${({ theme }) => theme.colors.gray900};
  border-radius: 0.75rem;
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.white};
  white-space: nowrap;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 200;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
`;

const ScrollContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 90px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 12px;

  & > * {
    flex-shrink: 0;
  }
`;

const SummaryWrapper = styled.div`
  width: 390px;
  max-width: 100%;
  flex-shrink: 0;
`;

const FloatingWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
`;

const PROMISE_STATUS_LABEL = { PENDING: '진행 중', CONFIRMED: '확정', CANCELED: '취소됨' };
const MY_STATUS_LABEL = { ACCEPTED: '참석', REJECTED: '불참', PENDING: '미응답' };

function formatPromiseDate(promise) {
  const start = new Date(promise.startTime);
  const end = new Date(promise.endTime);
  const pad = (n) => String(n).padStart(2, '0');
  const dateLabel = promise.proposeStartDate.replaceAll('-', '.');
  const startLabel = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
  const endLabel = `${pad(end.getHours())}:${pad(end.getMinutes())}`;
  return `${dateLabel} ${startLabel}~${endLabel}`;
}

export default function RoomInfoPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('tab1');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const room = useRoomStore((state) => state.roomDetail);
  const fetchRoomDetail = useRoomStore((state) => state.fetchRoomDetail);
  const myProfile = useFriendStore((state) => state.myProfile);
  const fetchMyProfile = useFriendStore((state) => state.fetchMyProfile);
  const [isHost, setIsHost] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000);
  }

  useEffect(() => {
    fetchRoomDetail(Number(roomId));
    fetchMyProfile();
  }, [roomId, fetchRoomDetail, fetchMyProfile]);

  useEffect(() => {
    if (!myProfile) return;
    apiClient.get(`/rooms/${roomId}/members`).then((res) => {
      const me = res.data.find((m) => m.userId === myProfile.id);
      setIsHost(me?.role === 'HOST');
    });
  }, [roomId, myProfile]);

  // TODO: GET /api/rooms/:id/unread — 안 읽은 채팅 여부 API 연동 후 교체
  const hasUnreadChat = false;

  if (!room) return null; // TODO: 로딩 스피너로 교체

  const promises = currentTab === 'tab1' ? room.myPromises : room.invitedPromises;

  async function handleLeaveRoom() {
    setIsSheetOpen(false);
    if (isHost) {
      showToast('방장은 나갈 수 없어요.');
      return;
    }
    try {
      await apiClient.delete(`/rooms/${roomId}/members/me`);
      navigate('/room-list');
    } catch (err) {
      showToast(err.message || '방 나가기에 실패했어요.');
    }
  }

  async function handleDeleteRoom() {
    setIsSheetOpen(false);
    try {
      await apiClient.delete(`/rooms/${roomId}`);
      navigate('/room-list');
    } catch (err) {
      showToast(err.message || '방 삭제에 실패했어요.');
    }
  }

  return (
    <PageContainer>
      <HeaderWrapper>
        <Header
          title={room.name}
          leftIcon="back"
          onLeft={() => navigate(-1)}
          icons={[hasUnreadChat ? 'bubble-noti' : 'bubble', 'more']}
          onIconClick={(icon) => {
            if (icon === 'bubble' || icon === 'bubble-noti') navigate(`/room/${roomId}/chat`);
            if (icon === 'more') setIsSheetOpen(true);
          }}
        />
      </HeaderWrapper>

      <ScrollContent>
        <SummaryWrapper>
          <RoomSummarySection
            roomId={Number(roomId)}
            name={room.name}
            description={room.description}
            imageUrl={room.imageUrl}
            profileImages={room.memberProfileImages}
            totalMemberCount={room.totalMemberCount}
            isHost={isHost}
          />
        </SummaryWrapper>

        <TabBtn activeTab={currentTab} onTabClick={setCurrentTab} />

        <CardList>
          {promises.map((promise) => (
            <ScheduleCard
              key={promise.promiseId}
              title={promise.title}
              date={formatPromiseDate(promise)}
              location={promise.location}
              acceptedCount={promise.acceptedCount}
              totalCount={promise.totalMemberCount}
              chipLabel={
                currentTab === 'tab1'
                  ? PROMISE_STATUS_LABEL[promise.promiseStatus]
                  : MY_STATUS_LABEL[promise.myStatus]
              }
              onClick={() =>
                navigate('/my-appointments', {
                  state: {
                    promiseId: promise.promiseId,
                    roomId: Number(roomId),
                    isInvited: currentTab === 'tab2',
                  },
                })
              }
            />
          ))}
        </CardList>
      </ScrollContent>

      <FloatingWrapper>
        <AddBtn onClick={() => navigate('/create-appointment', { state: { roomId: Number(roomId) } })} />
      </FloatingWrapper>

      {isSheetOpen && (
        <ActionSheet
          visible={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          option1Text={isHost ? '방 수정하기' : undefined}
          option2Text={isHost && room.totalMemberCount === 1 ? '방 삭제하기' : '방 나가기'}
          option2Color="#E31818"
          onOption1={isHost ? () => {
            setIsSheetOpen(false);
            navigate('/create-room', {
              state: { roomId: Number(roomId), name: room.name, description: room.description, imageUrl: room.imageUrl },
            });
          } : undefined}
          onOption2={
            isHost && room.totalMemberCount === 1
              ? () => { setIsSheetOpen(false); setShowDeleteConfirm(true); }
              : handleLeaveRoom
          }
        />
      )}

      <ConfirmPopup
        visible={showDeleteConfirm}
        title={`${room.name}을(를)\n삭제하시겠습니까?`}
        confirmText="삭제"
        danger
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          handleDeleteRoom();
        }}
      />

      <Toast $visible={!!toastMessage}>{toastMessage}</Toast>
    </PageContainer>
  );
}