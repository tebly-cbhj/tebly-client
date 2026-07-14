import styled from 'styled-components';
import { useMemo, Fragment, useState, useRef, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import { parseDate, parseTime, expandRepeatingSchedules } from '../../utils/DateUtils';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import WeekDateCell from '../../components/calendar/week/WeekDateCell';
import WeekAllDayRow from '../../components/calendar/week/WeekAllDayRow';
import TimeSlotCell from '../../components/calendar/week/TimeSlotCell';
import ScheduleBlock from '../../components/calendar/week/ScheduleBlock';
import { useScheduleStore } from '../../store/ScheduleStore';
import { usePersonalScheduleStore } from '../../store/PersonalScheduleStore';
import CalendarFab from '../../components/calendar/CalendarFab';

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

// 백엔드에 종일 여부 필드가 없어서, 시작~종료가 하루 전체(00:00~23:59)를
// 덮는 일정을 종일 일정으로 간주함
function isAllDayTime(timeStr) {
  if (!timeStr) return false;
  const { startMinutes, durationMinutes } = parseTime(timeStr);
  return startMinutes === 0 && durationMinutes >= 1439;
}

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
  const fetchSchedules = usePersonalScheduleStore((state) => state.fetchSchedules);
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

  useEffect(() => {
    const y = sunday.getFullYear();
    const m = String(sunday.getMonth() + 1).padStart(2, '0');
    const d = String(sunday.getDate()).padStart(2, '0');
    fetchSchedules('weekly', `${y}-${m}-${d}`);
  }, [sunday, fetchSchedules]);

  const weekGroup = useMemo(() =>
    groupSchedules.filter((s) => {
      const date = parseDate(s.date);
      return date >= sunday && date <= saturday;
    }), [groupSchedules, sunday, saturday]
  );

  const getDayIndex = (schedule) => schedule._occurrenceDate.getDay();

  const allDayEventsByDay = useMemo(() => {
    const byDay = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    weekPersonal
      .filter((schedule) => isAllDayTime(schedule.time))
      .forEach((schedule) => {
        byDay[getDayIndex(schedule)].push({
          id: `${schedule.id}-${schedule._occurrenceDate.toISOString()}`,
          category: schedule.category?.categoryIcon,
          title: schedule.title,
          onClick: () => handleScheduleClick(schedule, schedule._occurrenceDate),
        });
      });

    weekGroup
      .filter((schedule) => isAllDayTime(schedule.time))
      .forEach((schedule) => {
        byDay[parseDate(schedule.date).getDay()].push({
          id: schedule.id,
          category: categoryIconMap[schedule.category],
          title: schedule.title,
          onClick: () => handleScheduleClick(schedule, null),
        });
      });

    return byDay;
  }, [weekPersonal, weekGroup]);

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
          place: schedule.location || '',
          category: schedule.category && typeof schedule.category === 'object'
            ? schedule.category
            : (categoryIconMap[schedule.category] || schedule.category || 'Other'),
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
        onNotificationClick={() => navigate('/noti-invitaion')} // TODO: 알림 페이지 navigate 연동
        onDateChange={(date) => {
          onDateChange?.(date);
          // TODO: 선택된 날짜 기준으로 해당 주 일정 API 호출 연동
        }}
      />

      <WeekHeader>
        <WeekDateCell sunday={sunday} />
        <WeekAllDayRow eventsByDay={allDayEventsByDay} />
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

          {/* 개인 일정 블록 (종일 일정은 위쪽 종일 칩 줄에서 표시하므로 제외) */}
          {weekPersonal.filter((schedule) => !isAllDayTime(schedule.time)).map((schedule) => {
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
                  category={schedule.category?.categoryIcon}
                  text={schedule.title}
                  onClick={() => handleScheduleClick(schedule, schedule._occurrenceDate)}
                />
              </GridBlock>
            );
          })}

          {/* 그룹 일정 블록 (종일 일정은 위쪽 종일 칩 줄에서 표시하므로 제외) */}
          {weekGroup.filter((schedule) => !isAllDayTime(schedule.time)).map((schedule) => {
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
        <CalendarFab
          onDirectInput={() => navigate('/calendar/create')}
          onAiRecognition={(file) => navigate('/ocr-loading', { state: { imageFile: file } })}
        />
      </FloatingWrapper>
    </PageWrapper>
  );
}