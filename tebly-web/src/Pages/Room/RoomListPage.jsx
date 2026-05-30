import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageWrapper } from '../../PageWrapper';
import RoomListCard from '../../components/common/RoomListCard';
import { useRoomStore } from '../../store/RoomStore';
import AddBtn from '../../components/common/AddBtn';
import Header2 from '../../components/common/Header2'


const RoomListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; // 카드간 간격
  margin-top: 12px; 
  padding-bottom: 30px; 
  flex: 1;
  overflow-y: auto; // 세로 스크롤
  align-items: center;
  
  // 스크롤바 숨기기
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
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Header2 title="방" icons={['letter', 'bell']} />
      <RoomListContainer>
        {rooms.map((room) => (
          <RoomListCard
            key={room.id}
            title={room.title}
            description={room.description}
            members={room.members}
            onClick={() => navigate(`/room/${room.id}`)}  
          />
        ))}
      </RoomListContainer>

      <FloatingWrapper>
        <AddBtn onClick={() => navigate('/create-room')} />
      </FloatingWrapper>
      
    </PageWrapper>
  );
}