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

function getCurrentMonthLabel() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}.${month}`;
}

export default function CalendarHeader({
  viewMode = 'month',
  onViewModeChange,
  hasUnreadNotification = false, // TODO: 알림 존재 여부 상태(State) 바인딩 및 알림 API 연동
  onNotificationClick,
  onMonthConfirm, // 부모에서 선택된 연월 받을 때 사용
}) {
  const [monthLabel, setMonthLabel] = useState(getCurrentMonthLabel());
  const [showPicker, setShowPicker] = useState(false);

  const NotificationIcon = hasUnreadNotification ? BellNoti : BellLine;

  function handleConfirm({ year, month }) {
    const label = `${year}.${String(month).padStart(2, '0')}`;
    setMonthLabel(label);
    // TODO: 선택된 연월 기준으로 해당 월 일정 API 호출 연동
    onMonthConfirm?.({ year, month });
  }

  return (
    <>
      <Container>
        <MonthSelect
          label={monthLabel}
          onClick={() => setShowPicker(true)}
        />

        <RightArea>
          <MonthWeekToggle
            value={viewMode}
            onChange={onViewModeChange}
          />

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
        />
      )}
    </>
  );
}
