import { useState } from 'react';
import styled from 'styled-components';

// 요일 칸
const HeaderRow = styled.div`
  display: flex;
`;

const DayCell = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.gray900};
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.35px;
`;

function CalendarHeader() {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  return (
    <HeaderRow>
      {days.map((day, index) => (
        <DayCell key={index}>{day}</DayCell>
      ))}
    </HeaderRow>
  );
}

// 날짜 칸
const CellContainer = styled.div`
  width: 50px;
  height: 88px;
  position: relative;
  border-bottom: 0.5px solid ${(props) => props.theme.colors.gray300}; 
  cursor: pointer; /* 클릭 가능한 요소임을 보여줌 */
  
  // 선택된 날의 배경색을 gray300으로 변경
  background: ${(props) => 
    props.$isSelected 
      ? props.theme.colors.gray300 
      : props.theme.colors.white}; 
`;

const DateNumber = styled.div`
  position: absolute;
  top: 13.89px;
  width: 100%;
  text-align: center;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 140%; 
  letter-spacing: -0.35px;

  // 선택된 날짜의 글씨 색은 red100, 아니면 gray900
  color: ${(props) => 
    props.$isSelected && props.$hasMemo 
      ? props.theme.colors.red100 
      : props.theme.colors.gray900};
`;

const EventContainer = styled.div`
  position: absolute;
  bottom: 13.89px;
  left: 50%;
  transform: translateX(-50%);
  width: 37.5px;
  height: 32.421px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Pretendard', sans-serif;
  font-size: 10px;
  font-weight: 300;
  line-height: 140%;
  letter-spacing: -0.25px;

    // 선택된 날짜의 이벤트 글씨 색은 red100, 아니면 gray900
  color: ${(props) => 
    props.$isSelected
      ? props.theme.colors.red100 
      : props.theme.colors.gray900};
`;

function CalendarCell({ date, eventText, isSelected, onClick }) {
  const hasMemo = Boolean(eventText);

  return (
    <CellContainer $isSelected={isSelected} onClick={onClick}>
      <DateNumber $isSelected={isSelected} $hasMemo={hasMemo}>
        {date}
      </DateNumber>
      {hasMemo && (
        <EventContainer $isSelected={isSelected}>
          {eventText}
        </EventContainer>
      )}
    </CellContainer>
  );
}

// 달력 전체 컨테이너
const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px; 
`;

const CalendarBody = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 50px);
`;

export default function Calendar() {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <CalendarWrapper>
      <CalendarHeader />
      <CalendarBody>
        {daysInMonth.map((day) => {
          // 임시 일정 삽입
          const currentEvent = day % 3 === 0 ? '테이블리 회의' : null;
          
          return (
            <CalendarCell 
              key={day} 
              date={day} 
              eventText={currentEvent} 
              isSelected={selectedDate === day} 
              onClick={() => setSelectedDate(day)} 
            />
          );
        })}
      </CalendarBody>
    </CalendarWrapper>
  );
}