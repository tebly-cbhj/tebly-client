import styled from 'styled-components';
import ScheduleChip from '../month/ScheduleChip';

const Row = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 4px;
`;

const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 44px;
`;

export default function WeekAllDayRow({ eventsByDay }) {
  return (
    <Row>
      {Array.from({ length: 7 }, (_, dayIndex) => (
        <DayColumn key={dayIndex}>
          {(eventsByDay[dayIndex] || []).map((event) => (
            <ScheduleChip
              key={event.id}
              category={event.category}
              label={event.title}
              onClick={event.onClick}
            />
          ))}
        </DayColumn>
      ))}
    </Row>
  );
}
