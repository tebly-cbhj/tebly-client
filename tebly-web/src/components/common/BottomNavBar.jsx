import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';

import CalendarLine from '../../assets/icons/calendar-line.svg?react';
import CalendarFill from '../../assets/icons/calendar-fill.svg?react';
import FriendsGray from '../../assets/icons/friends-gray.svg?react';
import Friends from '../../assets/icons/friends.svg?react';
import RoomLine from '../../assets/icons/room-line.svg?react';
import RoomFill from '../../assets/icons/room-fill.svg?react';
import MoreLine from '../../assets/icons/more-line.svg?react';
import MoreFill from '../../assets/icons/more-fill.svg?react';

const NAV_ITEMS = [
  { id: 'calendar', label: '캘린더', to: '/', Line: CalendarLine, Fill: CalendarFill },
  { id: 'friends',  label: '친구',   to: '/friends',  Line: FriendsGray,  Fill: Friends },
  { id: 'room',     label: '방',     to: '/room-list',Line: RoomLine,     Fill: RoomFill },
  { id: 'more',     label: '더보기', to: '/more',     Line: MoreLine,     Fill: MoreFill },
];

const NavContainer = styled.nav`
  width: 100%;
  max-width: 390px;
  padding: 8px 24px 28px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.white};
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const NavButton = styled(NavLink)`
  display: flex;
  width: 48px;
  height: 52px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  text-decoration: none;
`;

const NavLabel = styled.span`
  color: ${({ $selected, theme }) => $selected ? theme.colors.gray900 : theme.colors.gray500};
  text-align: center;
  font-family: 'Pretendard Variable';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
`;

export default function BottomNavBar() {
  const { pathname } = useLocation();
  // TeblyApp(RN 웹뷰) 안에서는 네이티브 하단 탭바가 이미 있어서 웹 네비바는 숨김.
  // 탭 루트 경로(캘린더/친구/방/더보기)에서만 보여줌 — 하위 화면에서는 숨김.
  if (typeof window !== 'undefined' && window.ReactNativeWebView) return null;
  if (!NAV_ITEMS.some((item) => item.to === pathname)) return null;

  return (
    <NavContainer>
      {NAV_ITEMS.map(({ id, label, to, Line, Fill }) => (
        <NavButton key={id} to={to}>
          {({ isActive }) => {
            const Icon = isActive ? Fill : Line;
            return (
              <>
                <Icon width={24} height={24} />
                <NavLabel $selected={isActive}>{label}</NavLabel>
              </>
            );
          }}
        </NavButton>
      ))}
    </NavContainer>
  );
}