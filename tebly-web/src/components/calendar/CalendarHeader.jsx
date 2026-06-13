import styled from 'styled-components';
import MonthSelect from './month/MonthSelect';
import MonthWeekToggle from './MonthWeekToggle';
import BellLine from '../../assets/icons/bell-line.svg?react';
import BellNoti from '../../assets/icons/bell-noti.svg?react';

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

export default function CalendarHeader({
  monthLabel = '2026.06',
  viewMode = 'month',
  onMonthClick,
  onViewModeChange,
  hasUnreadNotification = false,
  onNotificationClick,
}) {
  const NotificationIcon = hasUnreadNotification ? BellNoti : BellLine;

  return (
    <Container>
      <MonthSelect
        label={monthLabel}
        onClick={onMonthClick}
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
  );
}