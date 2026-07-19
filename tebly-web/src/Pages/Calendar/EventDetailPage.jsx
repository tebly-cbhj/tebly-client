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

import { CATEGORY_ICON_MAP, CATEGORY_KO } from '../../components/room/CategoryIcons';
import apiClient from '../../api/client';
import { useLastSavedScheduleStore } from '../../store/LastSavedScheduleStore';

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
  const iconKey = category && typeof category === 'object' ? category.categoryIcon : category;
  const key = iconKey in CATEGORY_ICON_MAP ? iconKey : 'Other';
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
  /* 종일 일정이라 이 줄만 단독으로 보일 땐 위쪽이 허전해 보여서 살짝 내려줌 */
  margin-top: ${({ $solo }) => ($solo ? '6px' : '0')};
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
  width: 100%;
  max-width: 480px;
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

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || error.message || fallback;
}

export default function EventDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteScopeSheet, setShowDeleteScopeSheet] = useState(false);
  const lastSaved = useLastSavedScheduleStore((state) => state);

  // TODO: location.state 대신 scheduleId(URL 파라미터)로 GET /api/schedules/:id 호출하여 데이터 fetch
  const scheduleId = location.state?.scheduleId;
  const schedule = (lastSaved.scheduleId === scheduleId ? lastSaved.schedule : null)
    || location.state?.schedule || {
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

  const allDay = schedule.startTime === '00:00' && schedule.endTime === '23:59';
  const isRepeating = schedule.repeatType && schedule.repeatType !== 'NONE';
  // 방 약속은 이 페이지의 개인 일정 삭제 API 대상이 아님(scheduleId가 promiseId일 수 있음)
  const isPersonal = !schedule.sourceType || schedule.sourceType === 'PERSONAL';

  const categoryConfig = getCategoryConfig(schedule.category);
  const CategoryImg = categoryConfig.Icon;

  function handleDeleteOptionClick() {
    setShowActionSheet(false);
    if (isPersonal && isRepeating) {
      setShowDeleteScopeSheet(true);
      return;
    }
    deleteEntireSchedule();
  }

  async function deleteCurrentOccurrence() {
    setShowDeleteScopeSheet(false);
    if (!isPersonal) return;
    if (!scheduleId || !schedule.occurrenceStart) {
      alert('삭제할 반복 일정의 회차를 확인할 수 없어요.');
      return;
    }
    try {
      await apiClient.delete(`/schedules/events/${scheduleId}/occurrences`, {
        params: { occurrenceStart: schedule.occurrenceStart },
      });
      navigate(-1);
    } catch (error) {
      alert(getErrorMessage(error, '일정 삭제에 실패했어요. 다시 시도해주세요.'));
    }
  }

  async function deleteEntireSchedule() {
    setShowActionSheet(false);
    setShowDeleteScopeSheet(false);
    if (!isPersonal) return;
    if (!scheduleId) {
      navigate(-1);
      return;
    }
    try {
      await apiClient.delete(`/schedules/events/${scheduleId}`);
      navigate(-1);
    } catch (error) {
      alert(getErrorMessage(error, '일정 삭제에 실패했어요. 다시 시도해주세요.'));
    }
  }

  return (
    <PageWrapper>
      <Header
        title="일정"
        leftIcon="close"
        onLeft={() => navigate(-1)}
        icons={['more']}
        onIconClick={(icon) => { if (icon === 'more') setShowActionSheet(true); }}
      />

      <ActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        option1Text="수정"
        option2Text="일정 삭제"
        option2Color="#FF4646"
        onOption1={() => {
          setShowActionSheet(false);
          navigate('/calendar/create', { state: { scheduleId, schedule } });
        }}
        onOption2={handleDeleteOptionClick}
      />

      <ActionSheet
        visible={showDeleteScopeSheet}
        onClose={() => setShowDeleteScopeSheet(false)}
        option1Text="지금 일정만 삭제"
        option2Text="전체 일정 삭제"
        option2Color="#FF4646"
        onOption1={deleteCurrentOccurrence}
        onOption2={deleteEntireSchedule}
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
          {allDay && (
            <AllDayRow $solo>
              <IconBox><ClockIcon /></IconBox>
              <AllDayLabel>종일</AllDayLabel>
              <Toggle isOn={allDay} />
            </AllDayRow>
          )}
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
          text_selected={
            schedule.category && typeof schedule.category === 'object'
              ? schedule.category.categoryName
              : (CATEGORY_KO[schedule.category] ?? schedule.category)
          }
          state={schedule.category ? 'selected' : 'empty'}
        />

        <SelectRow
          LeftIcon={BellIcon}
          text_empty="알림 없음"
          text_selected={schedule.alarmTime}
          state={schedule.alarmTime ? 'selected' : 'empty'}
        />

        <SelectRow
          LeftIcon={RepeatIcon}
          text_empty="반복 없음"
          text_selected={schedule.repeat}
          state={schedule.repeat ? 'selected' : 'empty'}
        />
      </ScrollContent>
    </PageWrapper>
  );
}
