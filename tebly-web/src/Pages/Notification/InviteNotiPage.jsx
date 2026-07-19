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

  function getCategoryIcon(categoryId) {
    return categories.find((c) => c.categoryId === categoryId)?.categoryIcon;
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
                // TODO: PromiseInvitationResponse에 발신 주체 구분 필드가 없어서 아직 판단 불가.
                // 백엔드에 isFromDecisionBot(또는 senderType) 필드 추가되면 여기 연결.
                isFromDecisionBot={false}
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