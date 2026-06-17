import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import ActionSheet from '../../components/common/ActionSheet';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import Toggle from '../../components/common/Toggle';
import SelectRow from '../../components/room/SelectRow';

import ClockIcon from '../../assets/icons/clock.svg?react';
import PlaceIcon from '../../assets/icons/place.svg?react';
import CategoryIcon from '../../assets/icons/category.svg?react';
import BellIcon from '../../assets/icons/bell-line.svg?react';
import CalendarLineIcon from '../../assets/icons/calendar-line.svg?react';
import FriendsGrayIcon from '../../assets/icons/friends-gray.svg?react';
import RoomFillIcon from '../../assets/icons/room-fill.svg?react';
import MoreLineIcon from '../../assets/icons/more-line.svg?react';

import { CATEGORY_ICON_MAP } from '../../components/room/CategoryIcons';

const CATEGORY_BG = {
  Appointment:     { bg: '#FFBEBE', outline: '#FF8989' },
  Club:            { bg: '#FFC89C', outline: '#FF9A5C' },
  Family:          { bg: '#FFF4A9', outline: '#FFE134' },
  SelfDevelopment: { bg: '#B5DF9B', outline: '#7BC25A' },
  Work:            { bg: '#BAECFF', outline: '#76D5FF' },
  Class:           { bg: '#E2C7FF', outline: '#A779D9' },
  Leisure:         { bg: '#FFD0E5', outline: '#FF8FBD' },
  TeamProject:     { bg: '#C5C5C5', outline: '#909090' },
  Other:           { bg: '#B5DAD3', outline: '#76B5AA' },
};

function getCategoryConfig(category) {
  const key = category in CATEGORY_ICON_MAP ? category : 'Other';
  return {
    Icon: CATEGORY_ICON_MAP[key].SelectedIcon,
    ...CATEGORY_BG[key],
  };
}

import RepeatIcon from '../../assets/icons/repeat.svg?react';

const ScrollContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 88px;
  &::-webkit-scrollbar { display: none; }
`;

const ScheduleHeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0 20px;
`;

const CategoryImageBox = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 100px;
  background: ${({ $bg }) => $bg};
  outline: 2px ${({ $outline }) => $outline} solid;
  outline-offset: -2px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 80px;
    height: 80px;
    display: block;
  }
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const ScheduleTitle = styled.h2`
  margin: 0;
  ${({ theme }) => theme.typography.h2};
  color: ${({ theme }) => theme.colors.gray900};
`;

const ScheduleMemo = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray800};
`;

const DateTimeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
`;

const AllDayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const AllDayLabel = styled.span`
  flex: 1;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray900};
`;

const IconBox = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateTimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 32px;
`;

const DateLabel = styled.span`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray900};
`;

const TimeLabel = styled.span`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray900};
`;

const BottomNavBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 390px;
  padding: 8px 24px 28px;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

const TabItem = styled.div`
  width: 48px;
  height: 52px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const TabLabel = styled.span`
  ${({ theme }) => theme.typography.btn3};
  color: ${({ $active, theme }) => $active ? theme.colors.gray900 : theme.colors.gray500};
`;

export default function EventDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allDay, setAllDay] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const schedule = location.state?.schedule || {
    title: '미문 과제 제출',
    memo: '1,000자 내외 작성, 제출형식 pdf',
    startDate: '5월 12일 금요일',
    startTime: '17:00',
    endDate: '5월 12일 금요일',
    endTime: '18:00',
    place: '',
    category: 'Class',
    alarmTime: '1시간 전 알림',
    repeat: '반복 없음',
  };

  const categoryConfig = getCategoryConfig(schedule.category);
  const CategoryImg = categoryConfig.Icon;

  return (
    <PageWrapper>
      <Header
        title="일정"
        leftIcon="close"
        onLeft={() => navigate(-1)}
        icons={['more']}
        onIconClick={(icon) => { if (icon === 'more') setShowActionSheet(true); }}
      />

      {/* TODO: 수정/삭제 API 연동 필요 */}
      <ActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        option1Text="수정"
        option2Text="일정 삭제"
        option2Color="#FF4646"
        onOption1={() => {
          setShowActionSheet(false);
          console.log('수정');
        }}
        onOption2={() => {
          setShowActionSheet(false);
          console.log('일정 삭제');
        }}
      />

      <ScrollContent>
        <ScheduleHeaderSection>
          <CategoryImageBox $bg={categoryConfig.bg} $outline={categoryConfig.outline}>
            <CategoryImg />
          </CategoryImageBox>
          <TitleBox>
            <ScheduleTitle>{schedule.title}</ScheduleTitle>
            <ScheduleMemo>{schedule.memo}</ScheduleMemo>
          </TitleBox>
        </ScheduleHeaderSection>

        <DateTimeSection>
          <AllDayRow>
            <IconBox><ClockIcon /></IconBox>
            <AllDayLabel>종일</AllDayLabel>
            <Toggle isOn={allDay} onToggle={() => setAllDay(!allDay)} />
          </AllDayRow>
          {!allDay && (
            <>
              <DateTimeRow>
                <DateLabel>{schedule.startDate}</DateLabel>
                <TimeLabel>{schedule.startTime}</TimeLabel>
              </DateTimeRow>
              <DateTimeRow>
                <DateLabel>{schedule.endDate}</DateLabel>
                <TimeLabel>{schedule.endTime}</TimeLabel>
              </DateTimeRow>
            </>
          )}
        </DateTimeSection>

        <SelectRow
          LeftIcon={PlaceIcon}
          text_empty="장소 입력"
          text_selected={schedule.place}
          state={schedule.place ? 'selected' : 'empty'}
        />

        <SelectRow
          LeftIcon={CategoryIcon}
          text_empty="카테고리"
          text_selected={schedule.category}
          state={schedule.category ? 'selected' : 'empty'}
          right_icon
        />

        <SelectRow
          LeftIcon={BellIcon}
          text_empty="알림 없음"
          text_selected={schedule.alarmTime}
          state={schedule.alarmTime ? 'selected' : 'empty'}
          right_icon
        />

        <SelectRow
          LeftIcon={RepeatIcon}
          text_empty="반복 없음"
          text_selected={schedule.repeat}
          state={schedule.repeat ? 'selected' : 'empty'}
          right_icon
        />
      </ScrollContent>
    </PageWrapper>
  );
}
