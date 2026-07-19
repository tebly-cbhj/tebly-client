import { useState } from 'react';
import styled from 'styled-components';
import { DateHeader, DateCalendar } from './DatePicker';
import Btn from '../common/Btn';

import DragHandleIcon from '../../assets/icons/drag-handle.svg?react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  z-index: 9999;
  align-items: center;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 490px;
  height: 539px;
  border-radius: 32px 32px 0 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -4px 12px 0 rgba(68, 68, 68, 0.08);
`;

const DragHandleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;

  svg {
    display: block;
  }
`;

const DatePickerWrapper = styled.div`
  margin-top: 24px;
  padding: 0 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 36px;
  padding: 0 20px;
`;

const ResetButtonWrapper = styled.div`
  width: 120px;
`;

const ConfirmButtonWrapper = styled.div`
  flex: 1;
`;

function toMs(d) {
  if (!d) return null;
  return new Date(d.year, d.month - 1, d.day).getTime();
}

export default function DatePopup({
  onClose,
  onReset,
  onConfirm,
  leftBtnText = '초기화',
  rightBtnText = '선택 완료',
  onLeftBtn,
  onRightBtn,
  singleSelect = false,
  disablePast = false,
}) {
  const today = new Date();
  const todayMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [phase, setPhase] = useState('start');

  function prevMonth() {
    if (viewMonth === 1) {
      setViewYear((year) => year - 1);
      setViewMonth(12);
    } else {
      setViewMonth((month) => month - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 12) {
      setViewYear((year) => year + 1);
      setViewMonth(1);
    } else {
      setViewMonth((month) => month + 1);
    }
  }

  function resolveDate(day, type) {
    let year = viewYear;
    let month = viewMonth;

    if (type === 'prev') {
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
    }

    if (type === 'next') {
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }

    return { year, month, day };
  }

  function handleSelect(day, type) {
    const clicked = resolveDate(day, type);

    if (singleSelect) {
      setStartDate(clicked);
      setEndDate(null);
      return;
    }

    if (phase === 'start') {
      setStartDate(clicked);
      setEndDate(null);
      setPhase('end');
      return;
    }

    if (toMs(clicked) < toMs(startDate)) {
      setStartDate(clicked);
      setEndDate(null);
      setPhase('end');
      return;
    }

    setEndDate(clicked);
    setPhase('start');
  }

  function handleMouseEnter(day, type) {
    if (phase !== 'end' || !startDate) return;
    setHoverDate(resolveDate(day, type));
  }

  function getCellState(day, type) {
    if (type !== 'current') return 'disabled';

    const cellMs = new Date(viewYear, viewMonth - 1, day).getTime();

    if (disablePast && cellMs < todayMs) return 'disabled';
    const startMs = toMs(startDate);
    const endMs = toMs(endDate);
    const hoverMs = toMs(hoverDate);
    const effectiveEndMs = endMs ?? hoverMs;

    if (startMs === null) return 'default';

    if (singleSelect) {
      return cellMs === startMs ? 'single' : 'default';
    }

    if (effectiveEndMs === null) {
      return cellMs === startMs ? 'start' : 'default';
    }

    const lo = Math.min(startMs, effectiveEndMs);
    const hi = Math.max(startMs, effectiveEndMs);

    if (lo === hi && cellMs === lo) return 'single';
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

  function handleReset() {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
    setPhase('start');
    onReset?.();
  }

  function handleConfirm() {
    onConfirm?.({ start: startDate, end: endDate });
  }

  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <DragHandleWrapper>
          <DragHandleIcon />
        </DragHandleWrapper>

        <DatePickerWrapper>
          <DateHeader
            viewYear={viewYear}
            viewMonth={viewMonth}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
          />

          <DateCalendar
            viewYear={viewYear}
            viewMonth={viewMonth}
            getCellState={getCellState}
            isTodayCell={isTodayCell}
            onSelectDate={handleSelect}
            onMouseEnterDate={handleMouseEnter}
            onMouseLeaveCalendar={() => setHoverDate(null)}
          />
        </DatePickerWrapper>

        <ButtonRow>
          <ResetButtonWrapper>
            <Btn
              text={leftBtnText}
              size="medium"
              variant="gray"
              onClick={onLeftBtn ? () => onLeftBtn({ start: startDate, end: endDate }) : handleReset}
            />
          </ResetButtonWrapper>

          <ConfirmButtonWrapper>
            <Btn
              text={rightBtnText}
              size="medium"
              onClick={onRightBtn ?? handleConfirm}
            />
          </ConfirmButtonWrapper>
        </ButtonRow>
      </Sheet>
    </Overlay>
  );
}