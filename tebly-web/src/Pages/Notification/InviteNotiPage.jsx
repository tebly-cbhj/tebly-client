import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import ToggleBtn from '../../components/more/ToggleBtn';
import RoomInviteCard from '../../components/notification/RoomInviteCard';
import AppointmentInviteCard from '../../components/notification/AppointmentInviteCard';
import { useInviteStore } from '../../store/InviteStore';
import { useScheduleStore } from '../../store/ScheduleStore';

const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];
const pad = (n) => String(n).padStart(2, '0');

// 결정이 초대장의 충돌 안내 문구 분기 — 카테고리 정책이 바뀌면 백엔드와 같이 맞춰야 함
const ADJUSTABLE_CATEGORY_NAMES = new Set(['여가', '자기개발', '기타', '약속']);

function formatDateLabel(isoDateTime) {
  const d = new Date(isoDateTime);
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} (${WEEKDAY_KO[d.getDay()]})`;
}

function formatTimeLabel(startTimeIso, endTimeIso) {
  const start = new Date(startTimeIso);
  const end = new Date(endTimeIso);
  return `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())}`;
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 12px;
`;

const ToggleBtnWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-bottom: 90px;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ListContainer = styled.div`
  display: flex;
  width: 350px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

export default function InviteNotiPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(location.state?.tab ?? 'left'); // left: 방, right: 약속
  const {
    roomInvites,
    appointmentInvites,
    fetchInvitations,
    rejectRoomInvite,
    acceptRoomInvite,
    rejectAppointmentInvite,
    acceptAppointmentInvite,
    } = useInviteStore();
  const categories = useScheduleStore((state) => state.categories);
  const fetchCategories = useScheduleStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchInvitations();
    fetchCategories();
  }, [fetchInvitations, fetchCategories]);

  function getCategory(categoryId) {
    return categories.find((category) => category.categoryId === categoryId);
  }

  function getCategoryIcon(categoryId) {
    return getCategory(categoryId)?.categoryIcon;
  }

  function getConflictMessage(invite) {
    // 일반 사용자가 만든 약속에는 결정이 전용 충돌 문구를 표시하지 않는다.
    if (!invite.isFromDecisionBot) return null;
    // 결정이가 만든 약속이라도 일정 충돌이 없으면 문구를 표시하지 않는다.
    if (!invite.hasScheduleConflict) return null;

    // 백엔드가 내려준 이름을 우선 사용하고, 없으면 categoryId로 내 카테고리에서 찾는다.
    const categoryName =
      invite.conflictingCategoryName ?? getCategory(invite.conflictingCategoryId)?.categoryName;

    // ID 또는 이름이 일시적으로 불일치하는 경우에도 초대장 화면이 깨지지 않도록 처리한다.
    if (!categoryName) {
      return '이 시간엔 다른 일정이 있어요. 그래도 참여가 가능하신가요?';
    }

    if (ADJUSTABLE_CATEGORY_NAMES.has(categoryName)) {
      return `이 시간엔 ${categoryName} 일정이 있어요. 조정하실 수 있나요?`;
    }

    return `이 시간엔 ${categoryName} 일정이 있어요. 그래도 참여가 가능하신가요?`;
  }

  async function handleRespond(action, id) {
    try {
      await action(id);
    } catch (err) {
      alert(err.message || '처리에 실패했어요.');
      fetchInvitations();
    }
  }


  return (
    <PageWrapper>
      <Header
        title="초대장"
        leftIcon="back"
        onLeft={() => navigate(-1)}
      />

      <ContentWrapper>
        <ToggleBtnWrapper>
          <ToggleBtn
            value={tab}
            onChange={setTab}
            leftLabel="방"
            rightLabel="약속"
          />
        </ToggleBtnWrapper>
      </ContentWrapper>

      <ScrollArea>
        <ListContainer>
          {tab === 'left' ? (
            roomInvites.map((invite) => (
                <RoomInviteCard
                key={invite.roomId}
                roomName={invite.roomName}
                description={invite.description}
                inviter={invite.inviter}
                onReject={() => handleRespond(rejectRoomInvite, invite.roomId)}
                onAccept={() => handleRespond(acceptRoomInvite, invite.roomId)}
                />
            ))
            ) : (
            appointmentInvites.map((invite) => (
                <AppointmentInviteCard
                key={invite.promiseId}
                appointmentName={invite.title}
                date={formatDateLabel(invite.startTime)}
                time={formatTimeLabel(invite.startTime, invite.endTime)}
                location={invite.location}
                roomName={invite.roomName}
                categoryId={getCategoryIcon(invite.myCategoryId)}
                isFromDecisionBot={invite.isFromDecisionBot}
                conflictMessage={getConflictMessage(invite)}
                onReject={() => handleRespond(rejectAppointmentInvite, invite.promiseId)}
                onAccept={() => handleRespond(acceptAppointmentInvite, invite.promiseId)}
                />
            ))
            )}
        </ListContainer>
      </ScrollArea>
    </PageWrapper>
  );
}