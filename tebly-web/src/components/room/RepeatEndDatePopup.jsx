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
  width: 390px;
  height: 539px;
  border-radius: 32px 32px 0 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -4px 12px 0 rgba(68, 68, 68, 0.08);
`;

const DragHandleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
  svg { display: block; }
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
  width: 204px;
`;

function toMs(d) {
  if (!d) return null;
  return new Date(d.year, d.month - 1, d.day).getTime();
}

export default function RepeatEndDatePopup({ initialDate = null, onClose, onConfirm }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(initialDate?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate?.month ?? today.getMonth() + 1);
  const [selected, setSelected] = useState(initialDate);

  function prevMonth() {
    if (viewMonth === 1) { setViewYear((y) => y - 1); setViewMonth(12); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 12) { setViewYear((y) => y + 1); setViewMonth(1); }
    else setViewMonth((m) => m + 1);
  }

  function resolveDate(day, type) {
    let year = viewYear;
    let month = viewMonth;
    if (type === 'prev') { month -= 1; if (month < 1) { month = 12; year -= 1; } }
    if (type === 'next') { month += 1; if (month > 12) { month = 1; year += 1; } }
    return { year, month, day };
  }

  function handleSelect(day, type) {
    if (type !== 'current') return;
    setSelected(resolveDate(day, type));
  }

  function getCellState(day, type) {
    if (type !== 'current') return 'disabled';
    const cellMs = new Date(viewYear, viewMonth - 1, day).getTime();
    if (toMs(selected) === cellMs) return 'single';
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
            onMouseEnterDate={() => {}}
            onMouseLeaveCalendar={() => {}}
          />
        </DatePickerWrapper>

        <ButtonRow>
          <ResetButtonWrapper>
            <Btn text="초기화" size="medium" variant="gray" onClick={() => setSelected(null)} />
          </ResetButtonWrapper>
          <ConfirmButtonWrapper>
            <Btn text="선택 완료" size="medium" onClick={() => onConfirm?.(selected)} />
          </ConfirmButtonWrapper>
        </ButtonRow>
      </Sheet>
    </Overlay>
  );
}
