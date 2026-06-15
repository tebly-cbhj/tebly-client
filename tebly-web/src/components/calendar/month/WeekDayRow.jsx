import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  padding: 4px 0;
  justify-content: center;
`;

const DayCell = styled.div`
  width: 50px;
  text-align: center;
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray800};
`;

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function WeekDayRow() {
  return (
    <Row>
      {DAYS.map((day) => (
        <DayCell key={day}>{day}</DayCell>
      ))}
    </Row>
  );
}