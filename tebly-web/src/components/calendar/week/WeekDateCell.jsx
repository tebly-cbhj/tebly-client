import styled from 'styled-components';
import { getWeekDates } from '../../../utils/dateUtils';  


const Row = styled.div`
  display: flex;
  padding: 4px 0;
  justify-content: center;
`;

const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 44px;
`;

const DateCell = styled.div`
  text-align: center;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray900};
`;

const DayCell = styled.div`
  text-align: center;
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray800};
`;

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function WeekDateCell() {
  const weekDates = getWeekDates();

  return (
    <Row>
      {DAYS.map((day, i) => (
        <DayColumn key={day}>
          <DayCell>{day}</DayCell>
          <DateCell>{weekDates[i]}</DateCell>
        </DayColumn>
      ))}
    </Row>
  );
}