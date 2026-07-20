import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../../store/RoomStore';
import { useFriendStore } from '../../store/FriendStore';
import { useScheduleStore } from '../../store/ScheduleStore';
import { CATEGORY_ICON_MAP } from '../../components/room/CategoryIcons';
import apiClient from '../../api/client';
import RoomSummarySection from '../../components/room/RoomSummarySection';
import TabBtn from '../../components/common/TabBtn';
import ScheduleCard from '../../components/room/ScheduleCard';
import styled from 'styled-components';
import AddBtn from '../../components/common/AddBtn';
import Header from '../../components/common/Header';
import ActionSheet from '../../components/common/ActionSheet';
import ConfirmPopup from '../../components/common/ConfirmPopup';
import RoomMemberSheet from '../../components/room/RoomMemberSheet';

// PageWrapper와 같은 max-width/높이/배경이지만, HeaderWrapper가 이미
// 자체적으로 좌우 패딩을 갖고 있어서 패딩은 제외한 버전
const PageContainer = styled.div`
  width: 100%;
  max-width: 480px;
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
  background: rgba(26, 26, 26, 0.85);
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

  & > * {
    flex-shrink: 0;
  }
`;

const SummaryWrapper = styled.div`
  width: 100%;
  flex-shrink: 0;
`;

const FloatingWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 20px;
  z-index: 100;
`;

const PROMISE_STATUS_LABEL = { PENDING: '진행 중', CONFIRMED: '확정', CANCELED: '취소됨' };
const MY_STATUS_LABEL = { ACCEPTED: '참석', REJECTED: '불참', PENDING: '미응답' };

function getChipLabel(promise, isInvitedTab) {
  if (promise.promiseStatus === 'CANCELED') return PROMISE_STATUS_LABEL.CANCELED;
  if (new Date(promise.endTime) < new Date()) {
    return promise.promiseStatus === 'CONFIRMED' ? '완료' : '만료';
  }
  return isInvitedTab ? MY_STATUS_LABEL[promise.myStatus] : PROMISE_STATUS_LABEL[promise.promiseStatus];
}

// 정렬 우선순위(확정 여부는 안 보고 오직 시각만 기준): 0=지금 진행 중(맨 위),
// 1=아직 시작 전(날짜 가까운 순), 2=이미 끝남/취소됨(맨 아래)
function getPromiseSortPriority(promise) {
  if (promise.promiseStatus === 'CANCELED') return 2;
  const now = new Date();
  if (now > new Date(promise.endTime)) return 2;
  if (now >= new Date(promise.startTime)) return 0;
  return 1;
}

function sortPromises(promises) {
  return [...promises].sort((a, b) => {
    const priorityDiff = getPromiseSortPriority(a) - getPromiseSortPriority(b);
    if (priorityDiff !== 0) return priorityDiff;

    // 완료/만료 그룹은 최근에 끝난 순, 나머지는 약속 날짜가 가까운 순
    if (getPromiseSortPriority(a) === 2) {
      return new Date(b.endTime) - new Date(a.endTime);
    }
    return new Date(a.startTime) - new Date(b.startTime);
  });
}

function formatPromiseDate(promise) {
  const start = new Date(promise.startTime);
  const end = new Date(promise.endTime);
  const pad = (n) => String(n).padStart(2, '0');
  // 제안했던 기간(proposeStartDate)이 아니라 실제 잡힌 시각(startTime)의 날짜를 보여줘야
  // "완료" 판단 기준(endTime)이랑 화면에 보이는 날짜가 서로 어긋나지 않음
  const dateLabel = `${start.getFullYear()}.${pad(start.getMonth() + 1)}.${pad(start.getDate())}`;
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
  const rooms = useRoomStore((state) => state.rooms);
  const fetchRooms = useRoomStore((state) => state.fetchRooms);
  const myProfile = useFriendStore((state) => state.myProfile);
  const fetchMyProfile = useFriendStore((state) => state.fetchMyProfile);
  const categories = useScheduleStore((state) => state.categories);
  const fetchCategories = useScheduleStore((state) => state.fetchCategories);
  const [isHost, setIsHost] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [showMemberSheet, setShowMemberSheet] = useState(false);

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000);
  }

  function getCategoryImage(categoryId) {
    const iconKey = categories.find((c) => c.categoryId === categoryId)?.categoryIcon;
    return CATEGORY_ICON_MAP[iconKey]?.SelectedIcon;
  }

  useEffect(() => {
    fetchRoomDetail(Number(roomId));
    fetchMyProfile();
    fetchCategories();
    fetchRooms();
  }, [roomId, fetchRoomDetail, fetchMyProfile, fetchCategories, fetchRooms]);

  useEffect(() => {
    if (!myProfile) return;
    apiClient.get(`/rooms/${roomId}/members`).then((res) => {
      const me = res.data.find((m) => m.userId === myProfile.id);
      setIsHost(me?.role === 'HOST');
      setMembers(res.data);
    });
  }, [roomId, myProfile]);

  // 방 상세 API 자체엔 unreadCount가 없어서, 방 목록 API(RoomListResponse)에 있는 값을 대신 씀
  const hasUnreadChat = (rooms.find((r) => r.roomId === Number(roomId))?.unreadCount ?? 0) > 0;

  if (!room) return null; // TODO: 로딩 스피너로 교체

  const promises = sortPromises(currentTab === 'tab1' ? room.myPromises : room.invitedPromises);

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
          onLeft={() => navigate('/room-list')}
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
            onAvatarGroupClick={() => setShowMemberSheet(true)}
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
              CategoryImage={getCategoryImage(promise.myCategoryId)}
              chipLabel={getChipLabel(promise, currentTab === 'tab2')}
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

      {showMemberSheet && (
        <RoomMemberSheet
          onClose={() => setShowMemberSheet(false)}
          members={members}
        />
      )}
    </PageContainer>
  );
}