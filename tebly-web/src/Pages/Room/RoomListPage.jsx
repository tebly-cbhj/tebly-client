import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageWrapper } from '../../PageWrapper';
import RoomListCard from '../../components/room/RoomListCard';
import { useRoomStore } from '../../store/RoomStore';
import AddBtn from '../../components/common/AddBtn';
import Header2 from '../../components/common/Header2'


const RoomListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 12px;
  padding-bottom: 90px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  align-items: center;
  width: 100%;

  & > * {
    flex-shrink: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FloatingWrapper = styled.div`
  position: fixed;
  bottom: 20px; 
  right: 20px;
  z-index: 100; 
`;

export default function RoomListPage() {
  const rooms = useRoomStore((state) => state.rooms);
  const fetchRooms = useRoomStore((state) => state.fetchRooms);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <PageWrapper>
      <Header2
        title="방"
        icons={['letter', 'bell']}
        onIconClick={(icon) => {
          if (icon === 'letter' || icon === 'letter-noti') navigate('/noti-invitaion');
          if (icon === 'bell' || icon === 'bell-noti') navigate('/alarm');
        }}
      />
      <RoomListContainer>
        {rooms.map((room) => (
          <RoomListCard
            key={room.roomId}
            title={room.name}
            description={room.description}
            profileImages={room.memberProfileImages}
            totalMemberCount={room.totalMemberCount}
            onClick={() => navigate(`/room/${room.roomId}`)}  
          />
        ))}
      </RoomListContainer>

      <FloatingWrapper>
        <AddBtn onClick={() => navigate('/create-room')} />
      </FloatingWrapper>
      
    </PageWrapper>
  );
}