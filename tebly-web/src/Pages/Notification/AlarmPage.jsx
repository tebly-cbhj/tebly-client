import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import ToggleBtn from '../../components/more/ToggleBtn';
import NotiCard from '../../components/notification/NotiCard';

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

export default function AlarmPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('left'); // left: 일정/약속, right: 콕 찌르기

  // TODO: 알림 목록 API 연동
  // notifications, pokeNotifications를 useState로 변경
const [notifications, setNotifications] = useState([
  {
    id: 1,
    type: 'schedule',
    categoryId: 'SelfDevelopment',
    scheduleName: '헬스장',
    timeLeft: '2시간',
    notifiedAt: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
  },
  {
    id: 2,
    type: 'appointment',
    categoryId: 'Appointment',
    scheduleName: '떡볶이 모임',
    roomName: 'TAVE 13기',
    timeLeft: '1일',
    notifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 25),
    isRead: true,
    roomId: 1,
    scheduleId: 1,
  },
]);

const [pokeNotifications, setPokeNotifications] = useState([
  {
    id: 3,
    type: 'poke',
    categoryId: 'Appointment',
    scheduleName: '떡볶이 모임',
    pokerName: '홍길동',
    pokerProfileImage: null,
    userName: '김뿡치',
    notifiedAt: new Date(Date.now() - 1000 * 60 * 10),
    isRead: false,
    roomId: 1,
    scheduleId: 1,
  },
  {
    id: 4,
    type: 'poke',
    categoryId: 'Club',
    scheduleName: '동아리 회의',
    pokerName: '이철수',
    pokerProfileImage: null,
    userName: '김뿡치',
    notifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
    isRead: true,
    roomId: 2,
    scheduleId: 3,
  },
]);

// 읽음 처리 함수
function markAsRead(id) {
  if (tab === 'left') {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  } else {
    setPokeNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }
  // TODO: 읽음 처리 API 연동
}

  const currentList = tab === 'left' ? notifications : pokeNotifications;

  // 24시간 기준으로 새 알림/이전 알림 분류
  const now = new Date();
  const newNoti = currentList.filter(
    (n) => now - new Date(n.notifiedAt) < 1000 * 60 * 60 * 24
  );
  const oldNoti = currentList.filter(
    (n) => now - new Date(n.notifiedAt) >= 1000 * 60 * 60 * 24
  );

  // notifiedAt을 표시용 문자열로 변환
  function formatNotifiedAt(date) {
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;

    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  return (
    <PageWrapper>
      <Header
        title="알림"
        leftIcon="back"
        onLeft={() => navigate(-1)}
      />

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
        {/* 새 알림 */}
        {newNoti.length > 0 && (
          <SectionWrapper>
            <SectionTitle>새 알림</SectionTitle>
            {newNoti.map((noti) => (
              <NotiCard
                key={noti.id}
                type={noti.type}
                categoryId={noti.categoryId}
                scheduleName={noti.scheduleName}
                roomName={noti.roomName}
                timeLeft={noti.timeLeft}
                notifiedAt={formatNotifiedAt(noti.notifiedAt)}
                isRead={noti.isRead}
                pokerName={noti.pokerName}
                pokerProfileImage={noti.pokerProfileImage}
                userName={noti.userName}
                onClick={() => {
                  markAsRead(noti.id);
                  if (noti.type === 'schedule') {
                    navigate('/calendar/event-detail', {
                      state: {
                        scheduleId: noti.scheduleId,
                        schedule: {
                          title: noti.scheduleName,
                          startDate: '', // TODO: API 연동 후 실제 날짜로 대체
                          endDate: '',
                          startTime: '',
                          endTime: '',
                          place: '',
                          category: noti.categoryId,
                          alarmTime: '',
                          repeat: '',
                        },
                      },
                    });
                    // TODO: 개인 일정 상세 API 연동
                  }
                  if (noti.type === 'appointment' || noti.type === 'poke') {
                    navigate('/my-appointments', {
                      state: {
                        scheduleId: noti.scheduleId,
                        roomId: noti.roomId,
                      }
                    });
                    // TODO: 해당 방의 약속 상세로 이동 API 연동
                  }
                }}
              />
            ))}
          </SectionWrapper>
        )}

        {/* 이전 알림 */}
        {oldNoti.length > 0 && (
          <SectionWrapper>
            <SectionTitle>이전 알림</SectionTitle>
            {oldNoti.map((noti) => (
              <NotiCard
                key={noti.id}
                type={noti.type}
                categoryId={noti.categoryId}
                scheduleName={noti.scheduleName}
                roomName={noti.roomName}
                timeLeft={noti.timeLeft}
                notifiedAt={formatNotifiedAt(noti.notifiedAt)}
                isRead={noti.isRead}
                pokerName={noti.pokerName}
                pokerProfileImage={noti.pokerProfileImage}
                userName={noti.userName}
                onClick={() => {
                  markAsRead(noti.id);
                  if (noti.type === 'schedule') {
                    navigate('/calendar/event-detail', {
                      state: {
                        scheduleId: noti.scheduleId,
                        schedule: {
                          title: noti.scheduleName,
                          startDate: '', // TODO: API 연동 후 실제 날짜로 대체
                          endDate: '',
                          startTime: '',
                          endTime: '',
                          place: '',
                          category: noti.categoryId,
                          alarmTime: '',
                          repeat: '',
                        },
                      },
                    });
                    // TODO: 개인 일정 상세 API 연동
                  }
                  if (noti.type === 'appointment' || noti.type === 'poke') {
                    navigate('/my-appointments', {
                      state: {
                        scheduleId: noti.scheduleId,
                        roomId: noti.roomId,
                      }
                    });
                    // TODO: 해당 방의 약속 상세로 이동 API 연동
                  }
                }}
              />
            ))}
          </SectionWrapper>
        )}
      </ScrollArea>
    </PageWrapper>
  );
}