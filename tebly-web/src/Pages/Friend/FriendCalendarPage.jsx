import { useMemo, useState, useRef, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useFriendStore } from '../../store/FriendStore';
import WeekDayRow from '../../components/calendar/month/WeekDayRow';
import DateCell from '../../components/calendar/month/DateCell';
import MonthSelect from '../../components/calendar/month/MonthSelect';
import DatePickerPopup from '../../components/calendar/month/DatePickerPopup';
import MonthWeekToggle from '../../components/calendar/MonthWeekToggle';
import WeekDateCell from '../../components/calendar/week/WeekDateCell';
import TimeSlotCell from '../../components/calendar/week/TimeSlotCell';
import ScheduleBlock from '../../components/calendar/week/ScheduleBlock';

const Wrapper = styled.div`
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg};
  overflow: hidden;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 3.3125rem;
  padding: 1.125rem 1.625rem 0.875rem 1.6875rem;
  justify-content: space-between;
  align-items: center;
  aspect-ratio: 390/53;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const LeftArea = styled.div`
  display: flex;
  width: 64px;
  height: 32px;
  justify-content: flex-start;
  align-items: center;
`;

const BackBtn = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenterArea = styled.div`
  flex: 1 0 0;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FriendName = styled.span`
  color: #000;
  font-family: 'Pretendard Variable';
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.025rem;
`;

const RightArea = styled.div`
  width: 64px;
  height: 32px;
  flex-shrink: 0;
`;

const SubHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 12px 20px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 50px);
  justify-content: center;
`;

const WeekHeaderRow = styled.div`
  width: 340px;
  padding-left: 32px;
  margin: 0 auto;
  box-sizing: border-box;
  flex-shrink: 0;
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

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatMonthLabel(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}.${month}`;
}

function isSameDate(a, b) {
  return formatDateKey(a) === formatDateKey(b);
}

function createMonthDates(currentMonthDate) {
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const firstDay = firstDate.getDay();
  const lastDay = lastDate.getDay();
  const dates = [];
  for (let i = firstDay; i > 0; i -= 1) dates.push(new Date(year, month, 1 - i));
  for (let day = 1; day <= lastDate.getDate(); day += 1) dates.push(new Date(year, month, day));
  for (let i = 1; i < 7 - lastDay; i += 1) dates.push(new Date(year, month + 1, i));
  return dates;
}

function getWeekSunday(date) {
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - date.getDay());
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}

export default function FriendCalendarPage() {
  const navigate = useNavigate();
  const { friendId } = useParams();
  const friends = useFriendStore((s) => s.friends);
  const friend = friends.find((f) => String(f.id) === String(friendId));
  const friendEvents = useFriendStore((s) => s.friendSchedules[friendId]) || [];
  const fetchFriendSchedules = useFriendStore((s) => s.fetchFriendSchedules);

  const today = useMemo(() => new Date(), []);
  const [currentMonthDate, setCurrentMonthDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerKey, setPickerKey] = useState(0);
  const [viewMode, setViewMode] = useState('month');
  const [cellHeight, setCellHeight] = useState(60);
  const scrollRef = useRef(null);
  const lastDistanceRef = useRef(null);

  const monthDates = useMemo(() => createMonthDates(currentMonthDate), [currentMonthDate]);
  const sunday = useMemo(() => getWeekSunday(selectedDate), [selectedDate]);

  useEffect(() => {
    if (viewMode === 'week') {
      const y = sunday.getFullYear();
      const m = String(sunday.getMonth() + 1).padStart(2, '0');
      const d = String(sunday.getDate()).padStart(2, '0');
      fetchFriendSchedules(friendId, 'weekly', `${y}-${m}-${d}`);
    } else {
      const y = currentMonthDate.getFullYear();
      const m = String(currentMonthDate.getMonth() + 1).padStart(2, '0');
      fetchFriendSchedules(friendId, 'monthly', `${y}-${m}-01`);
    }
  }, [friendId, currentMonthDate, sunday, viewMode, fetchFriendSchedules]);

  const schedulesByDate = useMemo(() => {
    const grouped = {};
    friendEvents.forEach((event) => {
      const key = formatDateKey(new Date(event.startAt));
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({
        id: event.eventId,
        label: event.title,
        category: event.category?.categoryIcon || 'Other',
      });
    });
    return grouped;
  }, [friendEvents]);

  const weekEvents = useMemo(() => {
    if (viewMode !== 'week') return [];
    const weekEnd = new Date(sunday.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
    return friendEvents
      .filter((event) => {
        const start = new Date(event.startAt);
        return start >= sunday && start <= weekEnd;
      })
      .map((event) => {
        const start = new Date(event.startAt);
        const end = new Date(event.endAt);
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const durationMinutes = Math.max(5, (end - start) / 60000);
        return {
          id: event.eventId,
          title: event.title,
          category: event.category?.categoryIcon || 'Other',
          dayIndex: start.getDay(),
          startRow: Math.floor(startMinutes / 5) + 1,
          spanRows: Math.floor(durationMinutes / 5),
        };
      });
  }, [friendEvents, sunday, viewMode]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || viewMode !== 'week') return;

    const getDistance = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };
    const onTouchStart = (e) => {
      if (e.touches.length === 2) lastDistanceRef.current = getDistance(e.touches);
    };
    const onTouchMove = (e) => {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      const dist = getDistance(e.touches);
      const diff = dist - lastDistanceRef.current;
      setCellHeight((prev) => Math.min(60, Math.max(30, prev + diff * 0.1)));
      lastDistanceRef.current = dist;
    };
    const onTouchEnd = () => { lastDistanceRef.current = null; };

    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [viewMode]);

  return (
    <Wrapper>
      <Header>
        <LeftArea>
          <BackBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 20L7 12L17 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </BackBtn>
        </LeftArea>
        <CenterArea>
          <FriendName>{friend?.name ?? ''}</FriendName>
        </CenterArea>
        <RightArea />
      </Header>

      <SubHeader>
        <MonthSelect
          label={formatMonthLabel(currentMonthDate)}
          onClick={() => { setPickerKey((k) => k + 1); setShowPicker(true); }}
        />
        <MonthWeekToggle value={viewMode} onChange={setViewMode} />
      </SubHeader>

      {showPicker && (
        <DatePickerPopup
          key={pickerKey}
          onClose={() => setShowPicker(false)}
          onConfirm={({ year, month, day }) => {
            const d = new Date(year, month - 1, day);
            setCurrentMonthDate(d);
            setSelectedDate(d);
          }}
          initialDate={null}
        />
      )}

      {viewMode === 'month' ? (
        <ScrollArea>
          <WeekDayRow />
          <DateGrid>
            {monthDates.map((date) => {
              const dateKey = formatDateKey(date);
              const isCurrentMonth = date.getMonth() === currentMonthDate.getMonth();
              const isSelected = isSameDate(date, selectedDate);
              let variant = 'default';
              if (!isCurrentMonth) variant = 'muted';
              if (isSelected) variant = 'selected';
              return (
                <DateCell
                  key={dateKey}
                  date={date.getDate()}
                  schedules={schedulesByDate[dateKey] || []}
                  variant={variant}
                  onClick={() => setSelectedDate(date)}
                  onScheduleClick={() => {}}
                />
              );
            })}
          </DateGrid>
        </ScrollArea>
      ) : (
        <>
          <WeekHeaderRow>
            <WeekDateCell sunday={sunday} />
          </WeekHeaderRow>
          <ScrollArea ref={scrollRef}>
            <TimeTableWrapper $cellHeight={cellHeight}>
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

              {weekEvents.map((event) => (
                <GridBlock
                  key={event.id}
                  $startRow={event.startRow}
                  $spanRows={event.spanRows}
                  $dayIndex={event.dayIndex}
                >
                  <ScheduleBlock category={event.category} text={event.title} />
                </GridBlock>
              ))}
            </TimeTableWrapper>
          </ScrollArea>
        </>
      )}
    </Wrapper>
  );
}
