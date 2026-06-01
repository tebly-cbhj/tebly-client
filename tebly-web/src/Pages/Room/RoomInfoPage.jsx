import { useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import { useScheduleStore } from '../../store/ScheduleStore';
import {useRoomStore} from '../../store/RoomStore';
import RoomSummarySection from '../../components/room/RoomSummarySection';
import TabBtn from '../../components/common/TabBtn';
import ScheduleCard from '../../components/room/ScheduleCard';
import styled from 'styled-components';
import { PageWrapper } from '../../PageWrapper';
import AddBtn from '../../components/common/AddBtn';
import Header from '../../components/common/Header';
import ActionSheet from '../../components/common/ActionSheet';

const CardList = styled.div`
  display: flex;
  flex-direction: column;
`;

const SummaryWrapper = styled.div`
    width: 390px;
`;

const FloatingWrapper = styled.div`
  position: fixed;
  bottom: 20px; 
  right: 20px;
  z-index: 100; 
`;

export default function RoomInfoPage() {
  const { roomId } = useParams();  
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('tab1');
  const allSchedules = useScheduleStore((state) => state.schedules);
  const schedules = allSchedules.filter((s) => s.roomId === Number(roomId));
  const room = useRoomStore((state) => state.rooms.find((r) => r.id === Number(roomId)));
  const [isSheetOpen, setIsSheetOpen] = useState(false);  

  return (
    <PageWrapper>
      <Header 
        title={room?.title}
        leftIcon="chevron-left"
        onLeft={() => navigate(-1)}
        icons={['bubble', 'more']}
        onIconClick={(icon) => {
          if (icon === 'more') setIsSheetOpen(true);  // ← more 클릭시 열기
        }}
      />
        <SummaryWrapper>
            <RoomSummarySection roomId={Number(roomId)} />    
        </SummaryWrapper>
        <TabBtn activeTab={currentTab} onTabClick={setCurrentTab} />
        <CardList>
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              title={schedule.title}
              date={schedule.date}
              location={schedule.location}
              acceptedCount={schedule.acceptedIds.length}
              totalCount={schedule.memberIds.length}
              onClick={() => navigate('/my-appointments', {
                state: {
                  scheduleId: schedule.id,
                  roomId: Number(roomId)
                }
              })}
            />
          ))}
        </CardList>

        <FloatingWrapper>
            <AddBtn onClick={() => navigate('/my-appointments')} />
      </FloatingWrapper>
      {isSheetOpen && (
        <ActionSheet
          visible={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          option1Text="방 수정하기"
          option2Text="방 나가기"
          option2Color= "#E31818"
          onOption1={() => { setIsSheetOpen(false); }}
          onOption2={() => { setIsSheetOpen(false); }}
        />
      )}
    </PageWrapper>
  );
}