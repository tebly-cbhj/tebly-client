import styled from 'styled-components';
import { useMemo, Fragment, useState, useRef, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import { parseDate, parseTime, expandRepeatingSchedules } from '../../utils/dateUtils';
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
  grid-template-rows: repeat(288, ${({ $cellHeight }) => $cellHeight / 12}px);
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

function getWeekRangeFromDate(date) {
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - date.getDay());
  sunday.setHours(0, 0, 0, 0);
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  saturday.setHours(23, 59, 59, 999);
  return { sunday, saturday };
}

export default function WeekCalendarPage({ viewMode, onViewModeChange, selectedDate, onDateChange }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const lastDistanceRef = useRef(null);
  const [cellHeight, setCellHeight] = useState(60);

  const personalSchedules = usePersonalScheduleStore(
    useShallow((state) => state.schedules)
  );
  const groupSchedules = useScheduleStore(
    useShallow((state) => state.schedules.filter((s) => s.confirmed))
  );

  const { sunday, saturday } = useMemo(() => {
    const base = selectedDate
      ? new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day)
      : new Date();
    return getWeekRangeFromDate(base);
  }, [selectedDate]);

  const weekPersonal = useMemo(() =>
    expandRepeatingSchedules(personalSchedules, sunday, saturday),
    [personalSchedules, sunday, saturday]
  );

  const weekGroup = useMemo(() =>
    groupSchedules.filter((s) => {
      const date = parseDate(s.date);
      return date >= sunday && date <= saturday;
    }), [groupSchedules, sunday, saturday]
  );

  const getDayIndex = (schedule) => schedule._occurrenceDate.getDay();

  const monthLabel = selectedDate
    ? `${selectedDate.year}.${String(selectedDate.month).padStart(2, '0')}`
    : null;

  function handleScheduleClick(schedule, occurrenceDate) {
    const [startTime, endTime] = schedule.time ? schedule.time.split(' - ') : ['', ''];

    let dateStr;
    if (occurrenceDate) {
      const y = occurrenceDate.getFullYear();
      const m = String(occurrenceDate.getMonth() + 1).padStart(2, '0');
      const d = String(occurrenceDate.getDate()).padStart(2, '0');
      dateStr = `${y}.${m}.${d}`;
    } else {
      dateStr = schedule.date ? schedule.date.split(' ')[0] : '';
    }

    navigate('/calendar/event-detail', {
      state: {
        scheduleId: schedule.id,
        schedule: {
          title: schedule.title,
          memo: schedule.memo || '',
          startDate: dateStr,
          startTime: startTime || '',
          endDate: dateStr,
          endTime: endTime || '',
          place: schedule.place || '',
          category: categoryIconMap[schedule.category] || schedule.category || 'Other',
          alarmTime: schedule.alarmTime || '',
          repeat: schedule.repeat ? `${schedule.repeat.type} 반복` : '반복 없음',
        },
      },
    });
  }

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        lastDistanceRef.current = getDistance(e.touches);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault(); // ✅ 두 손가락일 때만 스크롤 막고 줌 처리
        const currentDistance = getDistance(e.touches);
        const diff = currentDistance - lastDistanceRef.current;
        setCellHeight(prev => Math.min(60, Math.max(30, prev + diff * 0.1)));
        lastDistanceRef.current = currentDistance;
      }
      // 한 손가락이면 아무것도 안 함 → 스크롤 정상 동작
    };

    const onTouchEnd = () => {
      lastDistanceRef.current = null;
    };

    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove, { passive: false }); // ✅ passive: false 필수
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <PageWrapper>
      <CalendarHeader
        monthLabel={monthLabel}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        hasUnreadNotification={false} // TODO: 알림 존재 여부 상태 바인딩 및 알림 API 연동
        onNotificationClick={() => console.log('알림 클릭')} // TODO: 알림 페이지 navigate 연동
        onDateChange={(date) => {
          onDateChange?.(date);
          // TODO: 선택된 날짜 기준으로 해당 주 일정 API 호출 연동
        }}
      />

      <WeekHeader>
        <WeekDateCell sunday={sunday} />
      </WeekHeader>

      <ScrollArea ref={scrollRef}>
        <TimeTableWrapper $cellHeight={cellHeight}>

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
                    $cellHeight={cellHeight}
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
                key={`${schedule.id}-${schedule._occurrenceDate.toISOString()}`}
                $startRow={startRow}
                $spanRows={spanRows}
                $dayIndex={getDayIndex(schedule)}
              >
                <ScheduleBlock
                  category={schedule.category}
                  text={schedule.title}
                  onClick={() => handleScheduleClick(schedule, schedule._occurrenceDate)}
                />
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
                  onClick={() => handleScheduleClick(schedule, null)}
                />
              </GridBlock>
            );
          })}

        </TimeTableWrapper>
      </ScrollArea>

      <FloatingWrapper>
        <AddBtn onClick={() => navigate('/ocr-loading')} />
      </FloatingWrapper>
    </PageWrapper>
  );
}