import { useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import { useScheduleStore } from '../../store/ScheduleStore';
import RoomSummarySection from '../../components/common/RoomSummarySection';
import TabBtn from '../../components/common/TabBtn';
import ScheduleCard from '../../components/common/ScheduleCard';
import styled from 'styled-components';
import { PageWrapper } from '../../PageWrapper';
import AddBtn from '../../components/common/AddBtn';

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
  const { schedules } = useScheduleStore();

  return (
    <PageWrapper>
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
            acceptedCount={schedule.acceptedCount}
            totalCount={schedule.totalCount}
          />
        ))}
      </CardList>

        <FloatingWrapper>
            <AddBtn onClick={() => navigate('/test')} />
      </FloatingWrapper>
    </PageWrapper>
  );
}