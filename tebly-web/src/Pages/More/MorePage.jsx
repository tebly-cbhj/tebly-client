import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header2 from '../../components/common/Header2';
import SectionCard from '../../components/more/SectionCard';
import SelectRow from '../../components/room/SelectRow';
import ConfirmPopup from '../../components/common/ConfirmPopup';
import EditSmallIcon from '../../assets/icons/edit-small.svg?react';
import BellLineIcon from '../../assets/icons/bell-line.svg?react';
import CategoryIcon from '../../assets/icons/category.svg?react';
import { useFriendStore } from '../../store/FriendStore';
import { useInviteStore } from '../../store/InviteStore';
import { useNotificationStore } from '../../store/NotificationStore';
import apiClient from '../../api/client';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 8px 0px 90px 0px;
  width: 100%;
  box-sizing: border-box;
`;

const ProfileCard = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  align-items: center;
  gap: 20px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
`;

const ProfileImage = styled.div`
  width: 68px;
  height: 68px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gray300};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Name = styled.span`
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
`;

const EditIcon = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
`;

const Bio = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray800};
`;

export default function MorePage() {
  const navigate = useNavigate();
  const user = useFriendStore((state) => state.myProfile);
  const fetchMyProfile = useFriendStore((state) => state.fetchMyProfile);
  const roomInvites = useInviteStore((state) => state.roomInvites);
  const appointmentInvites = useInviteStore((state) => state.appointmentInvites);
  const fetchInvitations = useInviteStore((state) => state.fetchInvitations);
  const notifications = useNotificationStore((state) => state.notifications);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  const hasUnreadInvite = roomInvites.length + appointmentInvites.length > 0;
  const hasUnreadNotification = notifications.some((n) => !n.isRead);

  useEffect(() => {
    fetchMyProfile();
    fetchInvitations();
    fetchNotifications();
  }, [fetchMyProfile, fetchInvitations, fetchNotifications]);

  if (!user) return null; // TODO: 로딩 스피너로 교체

  async function handleLogout() {
    try {
      await apiClient.post('/auth/signout');
    } catch {
      // 서버 로그아웃 실패해도 로컬은 로그아웃 처리함
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  }

  async function handleWithdraw() {
    try {
      const res = await apiClient.delete('/auth/withdraw');
      console.log('회원탈퇴 응답:', res);
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/onboarding');
  }

  return (
    <PageWrapper>
      <Header2
        title="더보기"
        icons={[hasUnreadInvite ? 'letter-noti' : 'letter', hasUnreadNotification ? 'bell-noti' : 'bell']}
        onIconClick={(icon) => {
          if (icon === 'letter' || icon === 'letter-noti') navigate('/noti-invitaion');
          if (icon === 'bell' || icon === 'bell-noti') navigate('/alarm');
        }}
      />

      <ContentWrapper>
        {/* 프로필 카드 */}
        <ProfileCard>
          <ProfileImage>
            {user.profileImageUrl
              ? <img src={user.profileImageUrl} alt="프로필" />
              : null // TODO: 기본 프로필 이미지 추가
            }
          </ProfileImage>

          <ProfileInfo>
            <NameRow>
              <Name>{user.nickname}</Name>
              <EditIcon onClick={() => navigate('/edit-profile')}> 
                <EditSmallIcon width={24} height={24} />
              </EditIcon>
            </NameRow>
            {user.bio && <Bio>{user.bio}</Bio>}
          </ProfileInfo>
        </ProfileCard>

        {/* 설정 섹션 */}
        <SectionCard title="설정">
          <SelectRow
            LeftIcon={BellLineIcon}
            text_empty="알림 설정"
            state="empty"
            right_icon={true}
            onClick={() => navigate('/alarm-setting')} 
          />
          <SelectRow
            LeftIcon={CategoryIcon}
            text_empty="카테고리 설정"
            state="empty"
            right_icon={true}
            onClick={() => navigate('/category-setting')} // TODO: 카테고리 설정 페이지 navigate 연동
          />
        </SectionCard>

        {/* 계정 섹션 */}
        <SectionCard title="계정">
          <SelectRow
            text_empty="비밀번호 변경"
            state="empty"
            right_icon={true}
            onClick={() => console.log('비밀번호 변경')} // TODO: 비밀번호 변경 페이지로 이동
          />
          <SelectRow
            text_empty="로그아웃"
            state="empty"
            right_icon={true}
            color="alert"
            onClick={() => setShowLogoutConfirm(true)}
          />
          <SelectRow
            text_empty="회원탈퇴"
            state="empty"
            right_icon={true}
            color="gray500"
            onClick={() => setShowWithdrawConfirm(true)}
          />
        </SectionCard>
      </ContentWrapper>

      <ConfirmPopup
        visible={showLogoutConfirm}
        title="로그아웃을 하시겠습니까?"
        confirmText="로그아웃"
        danger
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          handleLogout();
        }}
      />

      <ConfirmPopup
        visible={showWithdrawConfirm}
        title="회원탈퇴를 하시겠습니까?"
        confirmText="탈퇴"
        danger
        onCancel={() => setShowWithdrawConfirm(false)}
        onConfirm={() => {
          setShowWithdrawConfirm(false);
          handleWithdraw();
        }}
      />
    </PageWrapper>
  );
}