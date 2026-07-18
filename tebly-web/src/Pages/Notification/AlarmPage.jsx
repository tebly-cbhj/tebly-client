import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import ToggleBtn from '../../components/more/ToggleBtn';
import NotiCard from '../../components/notification/NotiCard';
import { useNotificationStore } from '../../store/NotificationStore';
import { useScheduleStore } from '../../store/ScheduleStore';
import { usePersonalScheduleStore, REPEAT_TYPE_TO_KO } from '../../store/PersonalScheduleStore';

// 서버의 notifications createdAt이 타임존 표시 없이(예: "2026-07-15T15:45:52") 오는데,
// 콕찌르기 알림의 createdAt만 아직 UTC 시각을 그대로 찍어서 내려주는 버그가 남아있음
// (일정 알림 쪽은 백엔드가 고쳐서 정상적인 한국시간으로 옴). 콕찌르기만 UTC로 간주해서
// 보정 파싱 — 콕찌르기 쪽도 백엔드가 마저 고치면 이 함수도 원복할 것.
function parseServerDate(dateStr, isPoke) {
  if (!dateStr) return new Date(NaN);
  const hasTimezone = /[Zz]|[+-]\d{2}:?\d{2}$/.test(dateStr);
  if (hasTimezone) return new Date(dateStr);
  return new Date(isPoke ? `${dateStr}Z` : dateStr);
}

// PageWrapper와 달리 좌우 패딩은 안 줌 — NotiCard가 안읽음 배경을
// 화면 끝까지 채우도록 리스트 영역은 엣지투엣지로 유지해야 해서,
// max-width/높이/배경만 가져온 버전
const PageContainer = styled.div`
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  height: 100vh;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.bg};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 12px;
`;

const ToggleBtnWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 90px;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  align-self: stretch;
`;

const SectionTitle = styled.span`
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
  padding: 12px 20px;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
`;

export default function AlarmPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('left'); // left: 일정/약속, right: 콕 찌르기
  const notifications = useNotificationStore((state) => state.notifications);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const categories = useScheduleStore((state) => state.categories);
  const fetchCategories = useScheduleStore((state) => state.fetchCategories);
  const fetchPersonalSchedules = usePersonalScheduleStore((state) => state.fetchSchedules);

  useEffect(() => {
    fetchNotifications();
    fetchCategories();
  }, [fetchNotifications, fetchCategories]);

  function getCategoryIcon(categoryId) {
    return categories.find((c) => c.categoryId === categoryId)?.categoryIcon;
  }

  const currentList = notifications.filter((n) =>
    tab === 'left' ? n.type !== 'POKE' : n.type === 'POKE'
  );

  const now = new Date();
  const newNoti = currentList.filter(
    (n) => now - parseServerDate(n.createdAt, n.type === 'POKE') < 1000 * 60 * 60 * 24
  );
  const oldNoti = currentList.filter(
    (n) => now - parseServerDate(n.createdAt, n.type === 'POKE') >= 1000 * 60 * 60 * 24
  );

  function formatNotifiedAt(date, isPoke) {
    const diff = now - parseServerDate(date, isPoke);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;

    const d = parseServerDate(date, isPoke);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  async function handleNotiClick(noti) {
    markAsRead(noti.id);
    if (noti.roomId) {
      // roomId가 있으면 scheduleId는 사실 약속(promise) ID를 재사용해서 담고 있음(redirectPath: "/promises/{scheduleId}"로 확인함)
      navigate('/my-appointments', {
        state: { promiseId: noti.scheduleId, roomId: noti.roomId, isInvited: true },
      });
      return;
    }

    if (!noti.scheduleId) return;

    // 개인 일정 단건 조회 API가 없어서, 알림이 발생한 달의 목록을 다시 불러와서
    // scheduleId가 일치하는 회차를 찾아 상세로 이동(반복 일정이면 알림 시각과 가장 가까운 회차를 선택)
    const notifiedDate = parseServerDate(noti.createdAt, noti.type === 'POKE');
    const y = notifiedDate.getFullYear();
    const m = String(notifiedDate.getMonth() + 1).padStart(2, '0');
    await fetchPersonalSchedules('monthly', `${y}-${m}-01`);

    const matches = usePersonalScheduleStore
      .getState()
      .schedules.filter((s) => s.id === noti.scheduleId);

    if (matches.length === 0) {
      navigate('/');
      return;
    }

    const match = matches.length === 1
      ? matches[0]
      : matches.reduce((closest, s) =>
          Math.abs(new Date(s.occurrenceStart) - notifiedDate) <
            Math.abs(new Date(closest.occurrenceStart) - notifiedDate)
            ? s
            : closest
        );

    const [startTime, endTime] = match.time ? match.time.split(' - ') : ['', ''];
    navigate('/calendar/event-detail', {
      state: {
        scheduleId: match.id,
        schedule: {
          title: match.title,
          memo: match.memo,
          startDate: match.startDate,
          startTime,
          endDate: match.endDate,
          endTime,
          place: match.location,
          category: match.category,
          alarmTime: match.alarmTime,
          repeat: match.repeat
            ? `${REPEAT_TYPE_TO_KO[match.repeat.type] || match.repeat.type} 반복`
            : '반복 없음',
          sourceType: match.sourceType,
          occurrenceStart: match.occurrenceStart,
          occurrenceEnd: match.occurrenceEnd,
          repeatType: match.repeatType,
        },
      },
    });
  }

  function renderSection(title, list) {
    if (list.length === 0) return null;
    return (
      <SectionWrapper>
        <SectionTitle>{title}</SectionTitle>
        {list.map((noti) => (
          <NotiCard
            key={noti.id}
            categoryId={getCategoryIcon(noti.categoryId)}
            type={noti.type}
            title={noti.title}
            content={noti.content}
            senderNickname={noti.senderNickname}
            senderProfileImageUrl={noti.senderProfileImageUrl}
            scheduleName={noti.scheduleName}
            notifiedAt={formatNotifiedAt(noti.createdAt, noti.type === 'POKE')}
            isRead={noti.isRead}
            onClick={() => handleNotiClick(noti)}
          />
        ))}
      </SectionWrapper>
    );
  }

  return (
    <PageContainer>
      <HeaderWrapper>
        <Header
          title="알림"
          leftIcon="back"
          onLeft={() => navigate(-1)}
        />
      </HeaderWrapper>
      <ContentWrapper>
        <ToggleBtnWrapper>
          <ToggleBtn
            value={tab}
            onChange={setTab}
            leftLabel="일정"
            rightLabel="콕 찌르기"
          />
        </ToggleBtnWrapper>
      </ContentWrapper>

      <ScrollArea>
        {renderSection('새 알림', newNoti)}
        {renderSection('이전 알림', oldNoti)}
      </ScrollArea>
    </PageContainer>
  );
}
