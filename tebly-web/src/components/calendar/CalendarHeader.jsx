import styled from 'styled-components';
import MonthSelect from './month/MonthSelect';
import MonthWeekToggle from './MonthWeekToggle';
import BellLine from '../../assets/icons/bell-line.svg?react';
import BellNoti from '../../assets/icons/bell-noti.svg?react';
import ChevronLeft from '../../assets/icons/chevron-left.svg?react';
import ChevronRight from '../../assets/icons/chevron-right.svg?react';

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

const NavButton = styled.button`
  width: 20px;
  height: 20px;
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

export default function CalendarHeader({
  monthLabel = '2026.06',
  viewMode = 'month',
  onPrevMonth,
  onNextMonth,
  onViewModeChange,
  hasUnreadNotification = false,
  onNotificationClick,
}) {
  const NotificationIcon = hasUnreadNotification ? BellNoti : BellLine;

  return (
    <Container>
      <LeftArea>
        <NavButton type="button" onClick={onPrevMonth} aria-label="이전 달">
          <ChevronLeft width={16} height={16} />
        </NavButton>
        <MonthSelect label={monthLabel} />
        <NavButton type="button" onClick={onNextMonth} aria-label="다음 달">
          <ChevronRight width={16} height={16} />
        </NavButton>
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
  );
}