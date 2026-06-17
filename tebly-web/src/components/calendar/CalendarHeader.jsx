import { useState } from 'react';
import styled from 'styled-components';
import MonthSelect from './month/MonthSelect';
import MonthWeekToggle from './MonthWeekToggle';
import BellLine from '../../assets/icons/bell-line.svg?react';
import BellNoti from '../../assets/icons/bell-noti.svg?react';
import DatePickerPopup from './month/DatepickerPopup';

const Container = styled.div`
  display: flex;
  width: 390px;
  padding: 12px 20px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  background: transparent;
`;

const RightArea = styled.div`
  display: flex;
  height: 32px;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

const BellButton = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

function getCurrentMonthLabel() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}.${month}`;
}

export default function CalendarHeader({
  viewMode = 'month',
  onViewModeChange,
  hasUnreadNotification = false,
  onNotificationClick,
  onDateChange,
  monthLabel: externalMonthLabel,
}) {
  const monthLabel = externalMonthLabel ?? getCurrentMonthLabel();
  const [showPicker, setShowPicker] = useState(false);
  const [lastSelectedDate, setLastSelectedDate] = useState(null);
  const [pickerKey, setPickerKey] = useState(0);

  const NotificationIcon = hasUnreadNotification ? BellNoti : BellLine;

  function handleOpen() {
    setPickerKey(prev => prev + 1);
    setShowPicker(true);
  }

  function handleConfirm({ year, month, day }) {
    setLastSelectedDate({ year, month, day });
    // TODO: 선택된 연월 기준으로 해당 월/주 일정 API 호출 연동
    onDateChange?.({ year, month, day });
  }

  return (
    <>
      <Container>
        <LeftArea>
          <MonthSelect
            label={monthLabel}
            onClick={handleOpen}
          />
        </LeftArea>
        <RightArea>
          <MonthWeekToggle
            value={viewMode}
            onChange={onViewModeChange}
          />
          {/* TODO: 알림 존재 여부 상태(State) 바인딩 및 알림 API 연동 */}
          <BellButton
            type="button"
            onClick={onNotificationClick}
            aria-label="알림"
          >
            <NotificationIcon width={24} height={24} />
          </BellButton>
        </RightArea>
      </Container>
      {showPicker && (
        <DatePickerPopup
          onClose={() => setShowPicker(false)}
          onConfirm={handleConfirm}
          initialDate={lastSelectedDate}
          key={pickerKey}
        />
      )}
    </>
  );
}