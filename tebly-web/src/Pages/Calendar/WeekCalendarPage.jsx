import styled from 'styled-components';
import { useMemo, Fragment } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {useNavigate} from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import { parseDate, parseTime, getWeekRange, expandRepeatingSchedules } from '../../utils/dateUtils';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import WeekDateCell from '../../components/calendar/week/WeekDateCell';
import TimeSlotCell from '../../components/calendar/week/TimeSlotCell';
import ScheduleBlock from '../../components/calendar/week/ScheduleBlock';
import { useScheduleStore } from '../../store/ScheduleStore';
import { usePersonalScheduleStore } from '../../store/PersonalScheduleStore';
import AddBtn from '../../components/common/AddBtn';

const WeekHeader = styled.div`
  display: flex;
  width: 308px;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  margin-left: 32px;
`;

const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 90px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TimeTableWrapper = styled.div`
  display: grid;
  grid-template-columns: 32px repeat(7, 44px);
  grid-template-rows: repeat(288, 5px);
  margin: 0 auto;
`;

const TimeLabel = styled.span`
  ${({ theme }) => theme.typography.caption2};
  color: ${({ theme }) => theme.colors.gray900};
  display: flex;
  align-items: start;
  justify-content: center;
`;

const GridBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  justify-self: stretch;
  grid-row: ${({ $startRow }) => $startRow} / span ${({ $spanRows }) => $spanRows};
  grid-column: ${({ $dayIndex }) => $dayIndex + 2} / span 1;
  position: relative;
  z-index: 1;
`;

const categoryIconMap = {
  '약속': 'Appointment',
  '동아리': 'Club',
  '가족': 'Family',
  '자기개발': 'SelfDevelopment',
  '알바': 'Work',
  '수업': 'Class',
  '여가': 'Leisure',
  '팀 프로젝트': 'TeamProject',
  '기타': 'Other',
};

const FloatingWrapper = styled.div`
  position: fixed;
  bottom: 20px; 
  right: 20px;
  z-index: 100; 
`;

export default function WeekCalendarPage({ viewMode, onViewModeChange }) {
  const navigate = useNavigate();
  const personalSchedules = usePersonalScheduleStore(
    useShallow((state) => state.schedules)
  );
  const groupSchedules = useScheduleStore(
    useShallow((state) => state.schedules.filter((s) => s.confirmed))
  );

  const { sunday, saturday } = getWeekRange();

  const weekPersonal = useMemo(() =>
    expandRepeatingSchedules(personalSchedules, sunday, saturday),
    [personalSchedules]
  );

  const weekGroup = useMemo(() =>
    groupSchedules.filter((s) => {
      const date = parseDate(s.date);
      return date >= sunday && date <= saturday;
    }), [groupSchedules]
  );

  const getDayIndex = (schedule) => schedule._occurrenceDate.getDay();

  return (
    <PageWrapper>
      <CalendarHeader
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        hasUnreadNotification={false}
        onMonthClick={() => console.log('월 선택 클릭')}
        onNotificationClick={() => console.log('알림 클릭')}
      />

      <WeekHeader>
        <WeekDateCell />
      </WeekHeader>

      <ScrollArea>
        <TimeTableWrapper>

          {/* 시간 레이블 + 셀 */}
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i + 1;
            return (
              <Fragment key={hour}>
                <TimeLabel style={{ gridRow: `${(hour - 1) * 12 + 1} / span 12`, gridColumn: 1 }}>
                  {`${hour}:00`}
                </TimeLabel>

                {Array.from({ length: 7 }, (_, j) => (
                  <TimeSlotCell
                    key={`cell-${hour}-${j}`}
                    style={{ gridRow: `${(hour - 1) * 12 + 1} / span 12`, gridColumn: j + 2 }}
                  />
                ))}
              </Fragment>
            );
          })}

          {/* 개인 일정 블록 */}
          {weekPersonal.map((schedule) => {
            const { startMinutes, durationMinutes } = parseTime(schedule.time);
            const startRow = Math.floor(startMinutes / 5) + 1;
            const spanRows = Math.floor(durationMinutes / 5);
            return (
              <GridBlock
                key={`${schedule.id}-${schedule._occurrenceDate.toISOString()}`} // key도 occurrenceDate 포함
                $startRow={startRow}
                $spanRows={spanRows}
                $dayIndex={getDayIndex(schedule)}
              >
                <ScheduleBlock category={schedule.category} text={schedule.title} />
              </GridBlock>
            );
          })}

          {/* 그룹 일정 블록 */}
          {weekGroup.map((schedule) => {
            const { startMinutes, durationMinutes } = parseTime(schedule.time);
            const startRow = Math.floor(startMinutes / 5) + 1;
            const spanRows = Math.floor(durationMinutes / 5);
            return (
              <GridBlock
                key={schedule.id}
                $startRow={startRow}
                $spanRows={spanRows}
                $dayIndex={parseDate(schedule.date).getDay()}
              >
                <ScheduleBlock
                  category={categoryIconMap[schedule.category]}
                  text={schedule.title}
                />
              </GridBlock>
            );
          })}


        </TimeTableWrapper>
      </ScrollArea>
      <FloatingWrapper>
        <AddBtn onClick={() => navigate('/create-room')} />
      </FloatingWrapper>
    </PageWrapper>
  );
}