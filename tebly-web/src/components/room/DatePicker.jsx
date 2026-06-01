import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import DateCell from './DateCell';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const PickerWrapper = styled.div`
  position: relative;
  width: 350px;
`;

const FieldWrapper = styled.div`
  display: flex;
  width: 350px;
  height: 48px;
  padding: 12px 16px;
  align-items: center;
  box-sizing: border-box;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.gray200};
  border: ${(props) => props.$focused ? `1px solid ${props.theme.colors.gray800}` : 'none'};
  cursor: pointer;
  gap: 8px;
`;

const DateGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
`;

const DateText = styled.span`
  ${(props) => props.theme.typography.body3}
  color: ${(props) => props.$hasValue ? props.theme.colors.gray800 : props.theme.colors.gray500};
`;

const Separator = styled.span`
  ${(props) => props.theme.typography.body3}
  color: ${(props) => props.theme.colors.gray500};
  flex-shrink: 0;
`;

const Slash = styled.span`
  ${(props) => props.theme.typography.body3}
  color: ${(props) => props.$active ? props.theme.colors.gray800 : props.theme.colors.gray500};
`;

const CalendarDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 100;
  background: ${(props) => props.theme.colors.white};
  border-radius: 12px;
  box-shadow: ${(props) => props.theme.effects.shadow2};
  padding: 16px 8px;
  width: 350px;
  box-sizing: border-box;
`;

const MonthHeader = styled.div`
  width: 336px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const MonthLabel = styled.span`
  ${(props) => props.theme.typography.h3}
  color: ${(props) => props.theme.colors.gray900};
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
  justify-content: center;
  margin-bottom: 4px;
`;

const DayLabel = styled.div`
  width: 3rem;
  padding: 4px 10px;
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Roboto;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: 0.03125rem;
  color: ${(props) => props.theme.colors.gray500};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 3rem);
  justify-content: center;
`;

function buildCalendarDays(year, month) {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const offset = firstDayOfWeek; // Sun-first (0=일, 1=월, ...)
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = new Date(year, month - 1, 0).getDate();

  const cells = [];
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, type: 'prev' });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, type: 'current' });
  }
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, type: 'next' });
  }
  return cells;
}

function toMs(d) {
  if (!d) return null;
  return new Date(d.year, d.month - 1, d.day).getTime();
}

function fmt(d) {
  if (!d) return null;
  return {
    year: String(d.year),
    month: String(d.month).padStart(2, '0'),
    day: String(d.day).padStart(2, '0'),
  };
}

export default function DatePicker({ value, onChange }) {
  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [startDate, setStartDate] = useState(value?.start ?? null);
  const [endDate, setEndDate] = useState(value?.end ?? null);
  const [hoverDate, setHoverDate] = useState(null);
  const [phase, setPhase] = useState('start'); // 'start' | 'end'
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setHoverDate(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function openPicker() {
    setIsOpen(o => !o);
    setHoverDate(null);
  }

  function prevMonth() {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  }

  function resolveDate(day, type) {
    let year = viewYear, month = viewMonth;
    if (type === 'prev') { month--; if (month < 1) { month = 12; year--; } }
    if (type === 'next') { month++; if (month > 12) { month = 1; year++; } }
    return { year, month, day };
  }

  function handleSelect(day, type) {
    const clicked = resolveDate(day, type);
    const clickedMs = toMs(clicked);

    if (phase === 'start') {
      setStartDate(clicked);
      setEndDate(null);
      setPhase('end');
    } else {
      const startMs = toMs(startDate);
      if (clickedMs < startMs) {
        // clicked is before start → reset start
        setStartDate(clicked);
        setEndDate(null);
        setPhase('end');
      } else {
        setEndDate(clicked);
        setPhase('start');
        setIsOpen(false);
        setHoverDate(null);
        onChange?.({ start: startDate, end: clicked });
      }
    }
  }

  function handleMouseEnter(day, type) {
    if (phase !== 'end' || !startDate) return;
    setHoverDate(resolveDate(day, type));
  }

  function getCellState(day, type) {
    if (type !== 'current') return 'disabled';

    const cellMs = new Date(viewYear, viewMonth - 1, day).getTime();
    const startMs = toMs(startDate);
    const endMs = toMs(endDate);
    const hoverMs = toMs(hoverDate);
    const effectiveEndMs = endMs ?? hoverMs;

    if (startMs === null) return 'default';

    if (effectiveEndMs === null) {
      return cellMs === startMs ? 'start' : 'default';
    }

    const lo = Math.min(startMs, effectiveEndMs);
    const hi = Math.max(startMs, effectiveEndMs);

    if (lo === hi && cellMs === lo) return 'start';
    if (cellMs === lo) return startMs <= effectiveEndMs ? 'start' : 'end';
    if (cellMs === hi) return startMs <= effectiveEndMs ? 'end' : 'start';
    if (cellMs > lo && cellMs < hi) return 'in-range';
    return 'default';
  }

  function isTodayCell(day, type) {
    return (
      type === 'current' &&
      today.getFullYear() === viewYear &&
      today.getMonth() + 1 === viewMonth &&
      today.getDate() === day
    );
  }

  const cells = buildCalendarDays(viewYear, viewMonth);
  const s = fmt(startDate);
  const e = fmt(endDate);

  return (
    <PickerWrapper ref={wrapperRef}>
      <FieldWrapper $focused={isOpen} onClick={openPicker}>
        <DateGroup>
          <DateText $hasValue={!!s}>{s?.year ?? 'YYYY'}</DateText>
          <Slash $active={!!s}>/</Slash>
          <DateText $hasValue={!!s}>{s?.month ?? 'MM'}</DateText>
          <Slash $active={!!s}>/</Slash>
          <DateText $hasValue={!!s}>{s?.day ?? 'DD'}</DateText>
        </DateGroup>

        <Separator>~</Separator>

        <DateGroup>
          <DateText $hasValue={!!e}>{e?.year ?? 'YYYY'}</DateText>
          <Slash $active={!!e}>/</Slash>
          <DateText $hasValue={!!e}>{e?.month ?? 'MM'}</DateText>
          <Slash $active={!!e}>/</Slash>
          <DateText $hasValue={!!e}>{e?.day ?? 'DD'}</DateText>
        </DateGroup>
      </FieldWrapper>

      {isOpen && (
        <CalendarDropdown>
          <MonthHeader>
            <NavBtn onClick={(e) => { e.stopPropagation(); prevMonth(); }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 7L9 12L15 17" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </NavBtn>
            <MonthLabel>{viewYear}년 {viewMonth}월</MonthLabel>
            <NavBtn onClick={(e) => { e.stopPropagation(); nextMonth(); }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                isToday={isTodayCell(cell.day, cell.type)}
                onClick={() => handleSelect(cell.day, cell.type)}
                onMouseEnter={() => handleMouseEnter(cell.day, cell.type)}
              />
            ))}
          </CalendarGrid>
        </CalendarDropdown>
      )}
    </PickerWrapper>
  );
}
