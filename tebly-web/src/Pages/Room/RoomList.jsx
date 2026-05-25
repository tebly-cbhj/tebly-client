import styled from 'styled-components';
import { PageWrapper } from '../../PageWrapper';
import RoomListCard from '../../components/common/RoomListCard';
import { useRoomStore } from '../../store/RoomStore';
import AddBtn from '../../components/common/AddBtn';

const RoomListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; // 카드간 간격
  margin-top: 12px; 
  padding-bottom: 30px; 
  flex: 1;
  overflow-y: auto; // 세로 스크롤
  
  // 스크롤바 숨기기
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FloatingWrapper = styled.div`
  position: absolute; 
  bottom: 20px; /* RN 탭바 바로 위(웹뷰 바닥)에서 20px 띄우기! */
  right: 20px;  /* 피그마 디자인에 맞춰 우측(또는 좌측/중앙) 여백 조절 */
  z-index: 100; /* 스크롤 위로 둥둥 떠 있도록 설정 */
`;

export default function RoomListPage() {
  const rooms = useRoomStore((state) => state.rooms);

  return (
    <PageWrapper>
      <RoomListContainer>
        {rooms.map((room) => (
          <RoomListCard
            key={room.id}
            title={room.title}
            description={room.description}
            avatars={room.avatars}
          />
        ))}
      </RoomListContainer>

      {/* ⭐️ 만들어두신 버튼을 위치 껍데기 안에 쏙 넣어줍니다 */}
      <FloatingWrapper>
        <AddBtn onClick={() => alert('일정 등록 페이지로 이동!')} />
      </FloatingWrapper>
      
    </PageWrapper>
  );
}