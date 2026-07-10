import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { PageWrapper } from '../../PageWrapper';
import TimeOptionCard from '../../components/room/TimeOptionCard';
import LoadingOverlay from '../../components/room/LoadingOverlay';
import Btn from '../../components/common/Btn';
import ChipScheduleOption from '../../components/room/ChipScheduleOption';
import SortButton from '../../components/common/SortButton';
import OptionItem from '../../components/room/OptionItem';
import DateCell from '../../components/room/DateCell';
import Header from '../../components/common/Header';
import AttendeePopup from '../../components/room/AttendeePopup';
import apiClient from '../../api/client';
import MagicWandIcon from '../../assets/icons/magicwand.svg?react';

// ─── 페이지 레이아웃 ────────────────────────────────────────────

const FilterBar = styled.div`
  display: flex;
  width: 24.375rem;
  padding: 0.5rem 1.25rem;
  justify-content: space-between;
  align-items: center;
`;

const CardList = styled.div`
  display: flex;
  width: 24.375rem;
  padding: 0 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding-bottom: 6rem;
  margin-top: 0.875rem;
`;

const BottomArea = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  padding: 0.75rem 1.25rem 2.125rem;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectBtnWrapper = styled.div`
  width: 17.5rem; /* 280px */
`;

const MagicWandBtn = styled.button`
  display: flex;
  width: 3.875rem; /* 62px */
  height: 3.375rem; /* 54px */
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  border-radius: 0.75rem;
  border: 2px solid var(--grayscale-gray-300, #DCDCDC);
  background: var(--grayscale-white, #FEFEFE);
  padding: 0;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }

  svg {
    width: 1.5rem; /* 24px */
    height: auto;
    aspect-ratio: 24 / 41.875;
  }
`;

// ─── 공용 시트 요소 ─────────────────────────────────────────────

const Dim = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.30);
  z-index: 100;
`;

const Handle = styled.div`
  width: 3rem;
  height: 0.3125rem;
  background: var(--grayscale-gray-300, #dcdcdc);
  border-radius: 6.25rem;
  margin: 0.75rem 0 0;
  flex-shrink: 0;
`;

// ─── 정렬 시트 ──────────────────────────────────────────────────

const SortSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24.375rem;
  height: 20.8125rem;
  border-radius: 2rem 2rem 0 0;
  background: var(--grayscale-white, #fefefe);
  z-index: 101;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SortHandle = styled(Handle)`
  margin: 0.75rem 0 1.5rem;
`;

const SortTitle = styled.span`
  ${({ theme }) => theme.typography.s1}
  color: ${({ theme }) => theme.colors.gray900};
  text-align: center;
  margin-bottom: 1.25rem;
`;

const SortOptionList = styled.div`
  display: flex;
  flex-direction: column;
  width: 21.875rem;
`;

const SortDivider = styled.div`
  width: 100%;
  height: 0.03125rem;
  background: #dcdcdc;
`;

const SORT_OPTIONS = [
  { value: 'recommended', label: '추천순' },
  { value: 'members',     label: '참여 인원순' },
  { value: 'earliest',   label: '빠른 시간순' },
  { value: 'latest',     label: '늦은 시간순' },
];

// ─── 날짜 선택 시트 ─────────────────────────────────────────────

const DateSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24.375rem;
  height: 33.6875rem;
  background: #fefefe;
  border-radius: 2rem 2rem 0 0;
  box-shadow: 0px -4px 12px rgba(68, 68, 68, 0.08);
  z-index: 101;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DateHandle = styled(Handle)`
  margin: 0.75rem auto 0;
`;

const CalendarArea = styled.div`
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 1.69rem;
  overflow: hidden;
`;

const MonthHeader = styled.div`
  display: flex;
  width: 21rem;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.25rem;
`;

const MonthLabel = styled.span`
  ${({ theme }) => theme.typography.h3}
  color: ${({ theme }) => theme.colors.gray900};
`;

const NavBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const DayHeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 3rem);
  margin-bottom: 0.25rem;
`;

const DayLabel = styled.div`
  width: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.typography.body3}
  color: ${({ theme }) => theme.colors.gray500};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 3rem);
`;

const DateButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0 1.25rem 2.125rem;
  margin-top: 0.75rem;
  flex-shrink: 0;
`;

const ResetBtn = styled.button`
  display: flex;
  width: 7.5rem;
  height: 2.75rem;
  padding: 1rem 0.625rem;
  justify-content: center;
  align-items: center;
  
  border-radius: 0.5rem;
  border: none;
  background: ${({ theme }) => theme.colors.gray200};
  ${({ theme }) => theme.typography.btn1}
  color: ${({ theme }) => theme.colors.gray800};
  cursor: pointer;
  
`;

const ConfirmBtn = styled.button`
  display: flex;
  width: 12.75rem;
  height: 2.75rem;
  padding: 1rem 0.625rem;
  justify-content: center;
  align-items: center;
  
  border-radius: 0.5rem;
  border: none;
  background: ${({ theme }) => theme.colors.primary100};
  ${({ theme }) => theme.typography.btn1}
  color: #fefefe;
  cursor: pointer;
`;

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const DAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function buildCalendarDays(year, month) {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = new Date(year, month - 1, 0).getDate();
  const cells = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, type: 'prev' });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, type: 'current' });
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) cells.push({ day: i, type: 'next' });
  return cells;
}

function toMs(d) {
  if (!d) return null;
  return new Date(d.year, d.month - 1, d.day).getTime();
}

function resolveDate(day, type, year, month) {
  let y = year, m = month;
  if (type === 'prev') { m--; if (m < 1) { m = 12; y--; } }
  if (type === 'next') { m++; if (m > 12) { m = 1; y++; } }
  return { year: y, month: m, day };
}

function formatDateForApi(d) {
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
}

function toAttendee(member) {
  return { id: member.userId, name: member.nickname, profileImage: member.profileImageUrl };
}

function toOptionViewModel(rec, index) {
  const start = new Date(rec.startTime);
  const end = new Date(rec.endTime);
  const pad = (n) => String(n).padStart(2, '0');
  return {
    id: index,
    date: start.getDate(),
    dayOfWeek: DAY_NAMES[start.getDay()],
    timeRange: `${pad(start.getHours())}:${pad(start.getMinutes())}~${pad(end.getHours())}:${pad(end.getMinutes())}`,
    memberCount: rec.availableMemberCount,
    totalCount: rec.totalMemberCount,
    availableAttendees: rec.availableMembers.map(toAttendee),
    unavailableAttendees: rec.unavailableMembers.map(toAttendee),
    startTimeRaw: rec.startTime,
    endTimeRaw: rec.endTime,
  };
}

// ─── 페이지 컴포넌트 ────────────────────────────────────────────

export default function TimeRecommendPage() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const today = new Date();

  const {
    roomId,
    promiseId,
    title,
    comment,
    categoryId,
    location,
    proposeStartDate: initialStart,
    proposeEndDate: initialEnd,
    minDuration,
    selectedMemberIds,
  } = routerLocation.state ?? {};

const isUpdateMode = Boolean(promiseId);

  const [selectedId, setSelectedId] = useState(null);
  const [attendeePopupOption, setAttendeePopupOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState('recommended');

  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: initialStart, end: initialEnd });
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [phase, setPhase] = useState('start');

  async function fetchRecommendations(range) {
    setIsLoading(true);
    try {
      const payload = {
        proposeStartDate: formatDateForApi(range.start),
        proposeEndDate: formatDateForApi(range.end),
        searchStartTime: '00:00',
        searchEndTime: '23:59',
        minDuration,
        sortType: 'EARLIEST',
      };
      const res = isUpdateMode
        ? await apiClient.post(`/promises/${promiseId}/time-recommendations`, payload)
        : await apiClient.post(`/rooms/${roomId}/promise-time-recommendations`, { ...payload, selectedMemberIds });
      setOptions(res.data.map(toOptionViewModel));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchRecommendations(dateRange);
    }
  }, []);

  const sortedOptions = useMemo(() => {
    const list = [...options];
    if (sortValue === 'members') return list.sort((a, b) => b.memberCount - a.memberCount);
    if (sortValue === 'earliest') return list.sort((a, b) => new Date(a.startTimeRaw) - new Date(b.startTimeRaw));
    if (sortValue === 'latest') return list.sort((a, b) => new Date(b.startTimeRaw) - new Date(a.startTimeRaw));
    return list;
  }, [options, sortValue]);

  const handleConfirm = async () => {
    const selectedOption = options.find((o) => o.id === selectedId);
    if (!selectedOption) return;

    setIsLoading(true);
    try {
      if (isUpdateMode) {
        await apiClient.patch(`/promises/${promiseId}/time/from-recommendation`, {
          proposeStartDate: formatDateForApi(dateRange.start),
          proposeEndDate: formatDateForApi(dateRange.end),
          searchStartTime: '00:00',
          searchEndTime: '23:59',
          recommendedStartTime: selectedOption.startTimeRaw,
          recommendedEndTime: selectedOption.endTimeRaw,
          minDuration,
          sortType: 'EARLIEST',
        });
        navigate(-1);
      } else {
        await apiClient.post(`/rooms/${roomId}/promises/from-recommendation`, {
          title,
          comment,
          categoryId,
          proposeStartDate: formatDateForApi(dateRange.start),
          proposeEndDate: formatDateForApi(dateRange.end),
          searchStartTime: '00:00',
          searchEndTime: '23:59',
          recommendedStartTime: selectedOption.startTimeRaw,
          recommendedEndTime: selectedOption.endTimeRaw,
          location,
          minDuration,
          sortType: 'EARLIEST',
          selectedMemberIds,
        });
        navigate(`/room/${roomId}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecisionHelper = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/api/v1/rooms/${roomId}/decision-helper`, {
        title,
        comment,
        categoryId,
        proposeStartDate: formatDateForApi(dateRange.start),
        proposeEndDate: formatDateForApi(dateRange.end),
        searchStartTime: '00:00',
        searchEndTime: '23:59',
        minDuration,
        sortType: 'RECOMMENDED',
        location,
        selectedMemberIds,
      });
      navigate(`/room/${roomId}/chat`);
    } finally {
      setIsLoading(false);
    }
  };
  const prevMonth = () => {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  };

  const handleDateSelect = (day, type) => {
    const clicked = resolveDate(day, type, viewYear, viewMonth);
    if (phase === 'start') {
      setStartDate(clicked); setEndDate(null); setPhase('end');
    } else {
      if (toMs(clicked) < toMs(startDate)) {
        setStartDate(clicked); setEndDate(null); setPhase('end');
      } else {
        setEndDate(clicked); setPhase('start'); setHoverDate(null);
      }
    }
  };

  const getCellState = (day, type) => {
    if (type !== 'current') return 'disabled';
    const cellMs = new Date(viewYear, viewMonth - 1, day).getTime();
    const startMs = toMs(startDate);
    const endMs = toMs(endDate);
    const effectiveEndMs = endMs ?? toMs(hoverDate);
    if (startMs === null) return 'default';
    if (effectiveEndMs === null) return cellMs === startMs ? 'start' : 'default';
    const lo = Math.min(startMs, effectiveEndMs);
    const hi = Math.max(startMs, effectiveEndMs);
    if (lo === hi && cellMs === lo) return 'start';
    if (cellMs === lo) return startMs <= effectiveEndMs ? 'start' : 'end';
    if (cellMs === hi) return startMs <= effectiveEndMs ? 'end' : 'start';
    if (cellMs > lo && cellMs < hi) return 'in-range';
    return 'default';
  };

  const handleDateReset = () => {
    setStartDate(null); setEndDate(null); setPhase('start'); setHoverDate(null);
  };

  const handleDateConfirm = () => {
    const newRange = { start: startDate, end: endDate };
    setDateRange(newRange);
    setIsDateSheetOpen(false);
    fetchRecommendations(newRange);
  };

  const cells = buildCalendarDays(viewYear, viewMonth);

  return (
    <PageWrapper noNav>
      <Header title={title ?? '약속 만들기'} leftIcon="back" onLeft={() => navigate(-1)} />

      <FilterBar>
        <ChipScheduleOption
          text={dateRange.start ? `${dateRange.start.month}.${dateRange.start.day}~${dateRange.end?.month}.${dateRange.end?.day}` : ''}
          onClick={() => setIsDateSheetOpen(true)}
        />
        <SortButton
          text={SORT_OPTIONS.find(o => o.value === sortValue)?.label ?? '추천순'}
          onClick={() => setIsSortOpen(true)}
        />
      </FilterBar>

      <CardList>
        {sortedOptions.map((option) => (
          <TimeOptionCard
            key={option.id}
            date={option.date}
            dayOfWeek={option.dayOfWeek}
            timeRange={option.timeRange}
            memberCount={option.memberCount}
            totalCount={option.totalCount}
            selected={selectedId === option.id}
            onClick={() => setSelectedId(option.id)}
          />
        ))}
      </CardList>

      <BottomArea>
        {isUpdateMode ? (
          <Btn text="선택 완료" disabled={selectedId === null} onClick={handleConfirm} navigate={navigate} />
        ) : (
          <>
            <MagicWandBtn onClick={handleDecisionHelper} disabled={isLoading} aria-label="결정이에게 맡기기">
              <MagicWandIcon />
            </MagicWandBtn>
            <SelectBtnWrapper>
              <Btn text="선택 완료" disabled={selectedId === null} onClick={handleConfirm} navigate={navigate} />
            </SelectBtnWrapper>
          </>
        )}
      </BottomArea>

      <LoadingOverlay isLoading={isLoading} />

      {attendeePopupOption && (
        <AttendeePopup
          availableAttendees={attendeePopupOption.availableAttendees}
          unavailableAttendees={attendeePopupOption.unavailableAttendees}
          onClose={() => setAttendeePopupOption(null)}
        />
      )}

      {isDateSheetOpen && (
        <>
          <Dim onClick={() => setIsDateSheetOpen(false)} />
          <DateSheet>
            <DateHandle />
            <CalendarArea>
              <MonthHeader>
                <NavBtn onClick={prevMonth}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 7L9 12L15 17" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </NavBtn>
                <MonthLabel>{viewYear}년 {viewMonth}월</MonthLabel>
                <NavBtn onClick={nextMonth}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 17L15 12L9 7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </NavBtn>
              </MonthHeader>
              <DayHeaderRow>
                {DAYS.map(d => <DayLabel key={d}>{d}</DayLabel>)}
              </DayHeaderRow>
              <CalendarGrid onMouseLeave={() => setHoverDate(null)}>
                {cells.map((cell, i) => (
                  <DateCell
                    key={i}
                    date={cell.day}
                    state={getCellState(cell.day, cell.type)}
                    isToday={
                      cell.type === 'current' &&
                      today.getFullYear() === viewYear &&
                      today.getMonth() + 1 === viewMonth &&
                      today.getDate() === cell.day
                    }
                    onClick={() => handleDateSelect(cell.day, cell.type)}
                    onMouseEnter={() => {
                      if (phase === 'end' && startDate)
                        setHoverDate(resolveDate(cell.day, cell.type, viewYear, viewMonth));
                    }}
                  />
                ))}
              </CalendarGrid>
            </CalendarArea>
            <DateButtonRow>
              <ResetBtn onClick={handleDateReset}>초기화</ResetBtn>
              <ConfirmBtn onClick={handleDateConfirm}>선택 완료</ConfirmBtn>
            </DateButtonRow>
          </DateSheet>
        </>
      )}

      {isSortOpen && (
        <>
          <Dim onClick={() => setIsSortOpen(false)} />
          <SortSheet>
            <SortHandle />
            <SortTitle>정렬</SortTitle>
            <SortOptionList>
              {SORT_OPTIONS.map((option, idx) => (
                <div key={option.value}>
                  {idx > 0 && <SortDivider />}
                  <OptionItem
                    text={option.label}
                    selected={sortValue === option.value}
                    onClick={() => { setSortValue(option.value); setIsSortOpen(false); }}
                  />
                </div>
              ))}
            </SortOptionList>
          </SortSheet>
        </>
      )}
    </PageWrapper>
  );
}