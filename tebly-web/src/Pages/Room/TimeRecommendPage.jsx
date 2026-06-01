import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageWrapper } from '../../PageWrapper';
import TimeOptionCard from '../../components/room/TimeOptionCard';
import LoadingOverlay from '../../components/room/LoadingOverlay';
import Btn from '../../components/common/Btn';
import ChipScheduleOption from '../../components/room/ChipScheduleOption';
import SortButton from '../../components/common/SortButton';
import OptionItem from '../../components/room/OptionItem';
import DateCell from '../../components/room/DateCell';
import ChevronLeft from '../../assets/icons/chevron-left.svg?react';

// ─── 페이지 레이아웃 ────────────────────────────────────────────

const Header = styled.div`
  display: flex;
  width: 24.375rem;
  padding: 4.25rem 1.25rem 0.75rem 1.25rem;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.s1}
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0;
`;

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
  padding: 0.75rem 1.25rem 2.125rem;
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

// ─── 목업 데이터 ────────────────────────────────────────────────

// TODO: API에서 추천 시간 목록 받아오기
// 예상 응답 형태: [{ id, date, dayOfWeek, timeRange, memberCount, totalCount }]
const dummyOptions = [
  { id: 1, date: 22, dayOfWeek: '금요일', timeRange: '11:00~13:00', memberCount: 4, totalCount: 6 },
  { id: 2, date: 22, dayOfWeek: '금요일', timeRange: '18:00~19:00', memberCount: 5, totalCount: 6 },
  { id: 3, date: 23, dayOfWeek: '토요일', timeRange: '11:00~13:00', memberCount: 4, totalCount: 6 },
  { id: 4, date: 24, dayOfWeek: '일요일', timeRange: '11:00~13:00', memberCount: 4, totalCount: 6 },
  { id: 5, date: 24, dayOfWeek: '일요일', timeRange: '11:00~13:00', memberCount: 4, totalCount: 6 },
];

// ─── 페이지 컴포넌트 ────────────────────────────────────────────

export default function TimeRecommendPage() {
  const navigate = useNavigate();
  const today = new Date();

  // TODO: useParams 등으로 roomId 받아오기
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 정렬 시트
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState('recommended');

  // 날짜 선택 시트
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  // TODO: 초기 날짜 범위를 방 생성 시 설정한 값으로 초기화
  const [dateRange, setDateRange] = useState(null);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [phase, setPhase] = useState('start');

  useEffect(() => {
    // TODO: 실제 API 호출로 교체 (추천 시간 목록 조회)
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = () => {
    setIsLoading(true);
    // TODO: 선택한 시간(selectedId)으로 약속 확정 API 호출
    // TODO: API 완료 후 setIsLoading(false) 및 다음 페이지로 navigate
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
    setDateRange({ start: startDate, end: endDate });
    setIsDateSheetOpen(false);
    setIsLoading(true);
    // TODO: 변경된 날짜 범위로 추천 시간 목록 재조회 API 호출
    // TODO: API 완료 후 setIsLoading(false) 및 목록 업데이트
  };

  const cells = buildCalendarDays(viewYear, viewMonth);

  return (
    <PageWrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft />
        </BackButton>
        <Title>약속 만들기</Title>
        <span style={{ width: '24px' }} />
      </Header>

      <FilterBar>
        <ChipScheduleOption
          // TODO: 초기값을 방 생성 시 설정한 날짜 범위로 교체
          text={dateRange?.start ? `${dateRange.start.month}.${dateRange.start.day}~${dateRange.end?.month}.${dateRange.end?.day}` : '5.17~5.26'}
          onClick={() => setIsDateSheetOpen(true)}
        />
        {/* TODO: 정렬 기준 변경 시 목록 재정렬 연동 */}
        <SortButton
          text={SORT_OPTIONS.find(o => o.value === sortValue)?.label ?? '추천순'}
          onClick={() => setIsSortOpen(true)}
        />
      </FilterBar>

      <CardList>
        {/* TODO: dummyOptions → API 응답 데이터로 교체 */}
        {dummyOptions.map((option) => (
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
        <Btn text="선택 완료" disabled={selectedId === null} onClick={handleConfirm} />
      </BottomArea>

      <LoadingOverlay isLoading={isLoading} />

      {/* 날짜 선택 시트 */}
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

      {/* 정렬 시트 */}
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
