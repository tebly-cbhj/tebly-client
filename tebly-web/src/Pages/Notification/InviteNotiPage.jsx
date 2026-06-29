import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import ToggleBtn from '../../components/more/ToggleBtn';
import RoomInviteCard from '../../components/notification/RoomInviteCard';
import AppointmentInviteCard from '../../components/notification/AppointmentInviteCard';
import { useInviteStore } from '../../store/InviteStore';

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
    rejectRoomInvite,
    acceptRoomInvite,
    rejectAppointmentInvite,
    acceptAppointmentInvite,
    } = useInviteStore();


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
                key={invite.id}
                roomName={invite.roomName} // TODO: API 연동 후 roomId로 가져오기
                description={invite.description}
                inviter={invite.inviter}
                onReject={() => rejectRoomInvite(invite.id)}
                onAccept={() => acceptRoomInvite(invite.id)}
                />
            ))
            ) : (
            appointmentInvites.map((invite) => (
                <AppointmentInviteCard
                key={invite.id}
                appointmentName={invite.title}
                date={invite.date}
                time={invite.time}
                location={invite.location}
                roomName={invite.roomName} // TODO: API 연동 후 roomId로 가져오기
                categoryId={invite.category}
                onReject={() => rejectAppointmentInvite(invite.id)}
                onAccept={() => acceptAppointmentInvite(invite.id)}
                />
            ))
            )}
        </ListContainer>
      </ScrollArea>
    </PageWrapper>
  );
}