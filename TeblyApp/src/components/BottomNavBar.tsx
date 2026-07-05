import React from 'react';
import styled, { useTheme } from 'styled-components/native';

import CalendarLine from '../assets/icons/calendar-line.svg';
import CalendarFill from '../assets/icons/calendar-fill.svg';
import FriendsLine from '../assets/icons/friends-line.svg';
import FriendsFill from '../assets/icons/friends-fill.svg';
import RoomLine from '../assets/icons/room-line.svg';
import RoomFill from '../assets/icons/room-fill.svg';
import MoreLine from '../assets/icons/more-line.svg';
import MoreFill from '../assets/icons/more-fill.svg';

// 전체 바 컨테이너
const NavBarContainer = styled.View`
  width: 100%;
  padding: 8px 24px 0px 24px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.white || '#FEFEFE'};
`;

// 탭 버튼 스타일
const TabButton = styled.TouchableOpacity`
  width: 48px;
  height: 52px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

// 메뉴 텍스트
const TabText = styled.Text<{ isActive: boolean }>`
  font-family: 'Pretendard-Regular';
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  line-height: 12px;
  align-self: stretch;
  color: ${(props) =>
    props.isActive ? props.theme.colors.red100 : props.theme.colors.gray900};
`;

// 메뉴 아이콘 + 경로 설정
const TABS = [
  { id: 'calendar', label: '캘린더', path: '/', LineIcon: CalendarLine, FillIcon: CalendarFill },
  { id: 'friends', label: '친구', path: '/friends', LineIcon: FriendsLine, FillIcon: FriendsFill },
  { id: 'room', label: '방', path: '/room-list', LineIcon: RoomLine, FillIcon: RoomFill },
  { id: 'more', label: '더보기', path: '/more', LineIcon: MoreLine, FillIcon: MoreFill },
];

export default function BottomNavBar({ onTabPress, currentPath }) {
  const theme = useTheme();

  return (
    <NavBarContainer>
      {TABS.map((tab) => {
        const isActive = currentPath === tab.path;
        const CurrentIcon = isActive ? tab.FillIcon : tab.LineIcon;

        return (
          <TabButton
            key={tab.id}
            onPress={() => onTabPress(tab.path)}
            activeOpacity={0.7}
          >
            <CurrentIcon
              width={24}
              height={24}
              color={isActive ? theme.colors.red100 : theme.colors.gray900}
            />

            <TabText isActive={isActive}>
              {tab.label}
            </TabText>
          </TabButton>
        );
      })}
    </NavBarContainer>
  );
}