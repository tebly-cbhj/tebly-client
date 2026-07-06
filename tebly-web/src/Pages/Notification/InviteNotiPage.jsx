import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import ToggleBtn from '../../components/more/ToggleBtn';
import RoomInviteCard from '../../components/notification/RoomInviteCard';
import AppointmentInviteCard from '../../components/notification/AppointmentInviteCard';
import { useInviteStore } from '../../store/InviteStore';

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
  const [tab, setTab] = useState('left'); // left: 방, right: 약속
  const {
    roomInvites,
    appointmentInvites,
    fetchInvitations,
    rejectRoomInvite,
    acceptRoomInvite,
    rejectAppointmentInvite,
    acceptAppointmentInvite,
    } = useInviteStore();

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);


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
                onReject={() => rejectRoomInvite(invite.roomId)}
                onAccept={() => acceptRoomInvite(invite.roomId)}
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
                // TODO: categoryId 없음 — 백엔드 응답에 카테고리 정보 추가되면 연동
                onReject={() => rejectAppointmentInvite(invite.promiseId)}
                onAccept={() => acceptAppointmentInvite(invite.promiseId)}
                />
            ))
            )}
        </ListContainer>
      </ScrollArea>
    </PageWrapper>
  );
}