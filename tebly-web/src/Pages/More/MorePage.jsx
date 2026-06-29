import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageWrapper } from '../../PageWrapper';
import Header2 from '../../components/common/Header2';
import SectionCard from '../../components/more/SectionCard';
import SelectRow from '../../components/room/SelectRow';
import EditSmallIcon from '../../assets/icons/edit-small.svg?react';
import BellLineIcon from '../../assets/icons/bell-line.svg?react';
import CategoryIcon from '../../assets/icons/category.svg?react';
// TODO: 유저 프로필 이미지 및 정보 API 연동

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 8px 20px 0 20px;
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
  // TODO: 유저 정보 API 연동 후 아래 하드코딩 데이터 대체
  const user = {
    name: '김뿡치',
    bio: '캘박하조 야호~',
    profileImage: null,
  };

  return (
    <PageWrapper>
      <Header2
        title="더보기"
        icons={['letter', 'bell']} // TODO: 알림/메시지 여부에 따라 'letter-noti', 'bell-noti'로 변경
        onIconClick={(icon) => console.log(icon)} // TODO: 각 아이콘 클릭 시 navigate 연동
      />

      <ContentWrapper>
        {/* 프로필 카드 */}
        <ProfileCard>
          <ProfileImage>
            {user.profileImage
              ? <img src={user.profileImage} alt="프로필" />
              : null // TODO: 기본 프로필 이미지 추가
            }
          </ProfileImage>

          <ProfileInfo>
            <NameRow>
              <Name>{user.name}</Name>
              <EditIcon onClick={() => navigate('/edit-profile')}> 
                <EditSmallIcon width={24} height={24} />
              </EditIcon>
            </NameRow>
            <Bio>{user.bio}</Bio>
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
            text_empty="로그아웃" // 회원 탈퇴 어디서 해요
            state="empty"
            right_icon={true}
            color="alert"  
            onClick={() => navigate('/onboarding')} // TODO: 로그아웃 API 연동
          />
        </SectionCard>
      </ContentWrapper>
    </PageWrapper>
  );
}