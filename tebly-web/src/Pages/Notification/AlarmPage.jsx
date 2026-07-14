import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import ToggleBtn from '../../components/more/ToggleBtn';
import NotiCard from '../../components/notification/NotiCard';
import { useNotificationStore } from '../../store/NotificationStore';
import { useScheduleStore } from '../../store/ScheduleStore';

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
    (n) => now - new Date(n.createdAt) < 1000 * 60 * 60 * 24
  );
  const oldNoti = currentList.filter(
    (n) => now - new Date(n.createdAt) >= 1000 * 60 * 60 * 24
  );

  function formatNotifiedAt(date) {
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;

    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  function handleNotiClick(noti) {
    markAsRead(noti.id);
    if (noti.roomId) {
      navigate('/my-appointments', {
        state: { scheduleId: noti.scheduleId, roomId: noti.roomId },
      });
    } else if (noti.scheduleId) {
      // 개인 일정 단건 조회 API가 없어서 상세로 바로 못 감 — 캘린더 홈으로 이동
      navigate('/');
    }
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
            notifiedAt={formatNotifiedAt(noti.createdAt)}
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
