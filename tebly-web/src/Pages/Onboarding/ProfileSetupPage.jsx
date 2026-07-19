import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import ProgressBar from '../../components/common/ProgressBar';
import TextFieldBase from '../../components/common/Textfield';
import Btn from '../../components/common/Btn';
import EditProfileImageIcon from '../../assets/icons/edit-profile-image.svg?react';
import { useFriendStore } from '../../store/FriendStore';

import Basic from '../../assets/default/profile/basic.svg?react';
import BasicSelected from '../../assets/default/profile/basic-selected.svg?react';
import BasicUrl from '../../assets/default/profile/basic-selected.svg';
import Wink from '../../assets/default/profile/wink.svg?react';
import WinkSelected from '../../assets/default/profile/wink-selected.svg?react';
import WinkUrl from '../../assets/default/profile/wink-selected.svg';
import Glasses from '../../assets/default/profile/glasses.svg?react';
import GlassesSelected from '../../assets/default/profile/glasses-selected.svg?react';
import GlassesUrl from '../../assets/default/profile/glasses-selected.svg';
import Sleepy from '../../assets/default/profile/sleepy.svg?react';
import SleepySelected from '../../assets/default/profile/sleepy-selected.svg?react';
import SleepyUrl from '../../assets/default/profile/sleepy-selected.svg';
import Headphone from '../../assets/default/profile/headphone.svg?react';
import HeadphoneSelected from '../../assets/default/profile/headphone-selected.svg?react';
import HeadphoneUrl from '../../assets/default/profile/headphone-selected.svg';

const PROFILE_ICONS = [
  { id: 'basic', Icon: Basic, SelectedIcon: BasicSelected, url: BasicUrl },
  { id: 'wink', Icon: Wink, SelectedIcon: WinkSelected, url: WinkUrl },
  { id: 'glasses', Icon: Glasses, SelectedIcon: GlassesSelected, url: GlassesUrl },
  { id: 'sleepy', Icon: Sleepy, SelectedIcon: SleepySelected, url: SleepyUrl },
  { id: 'headphone', Icon: Headphone, SelectedIcon: HeadphoneSelected, url: HeadphoneUrl },
];

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
`;

const ProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 12px;
`;

const Title = styled.p`
  ${({ theme }) => theme.typography.h2};
  color: #000;
  margin: 0;
  margin-top: 44px;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 24px;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
`;

const EditIconWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ProfileOptionList = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 21.667px;
  margin-top: 20px;
`;

const IconButton = styled.div`
  width: 44px;
  height: 44px;
  cursor: pointer;
`;

const InputName = styled.div`
  display: flex;
  width: 100%;
  padding: 8px 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  box-sizing: border-box;
  margin-top: 20px;
`;

const InputInfo = styled(InputName)`
  margin-top: 0;
`;

const Label = styled.span`
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
`;

const BtnWrapper = styled.div`
  position: fixed;
  bottom: 21px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 350px;
`;

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const updateMyProfile = useFriendStore((state) => state.updateMyProfile);
  const [selectedIcon, setSelectedIcon] = useState('basic');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const currentIcon = PROFILE_ICONS.find((p) => p.id === selectedIcon);
  const SelectedIcon = currentIcon?.SelectedIcon;

  const canNext = name.trim() !== '' && !isSaving;

  async function handleNext() {
    setIsSaving(true);
    try {
      await updateMyProfile({ nickname: name, bio, profileImageUrl: currentIcon?.url });
      navigate('/signup/schedule');
    } catch {
      alert('프로필 저장에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PageWrapper>
      <Header
        leftIcon="back"
        onLeft={() => navigate(-1)}
      />

      <ProgressWrapper>
        <ProgressBar step={2} total={3} />
      </ProgressWrapper>

      <ContentWrapper>
        <Title>프로필을 만들어볼게요.</Title>

        <ProfileSection>
          {/* 프로필 이미지 */}
          <ProfileImageWrapper>
            <ProfileImage>
              {SelectedIcon && <SelectedIcon width={80} height={80} />}
            </ProfileImage>
            <EditIconWrapper>
              <EditProfileImageIcon width={24} height={24} />
            </EditIconWrapper>
          </ProfileImageWrapper>

          {/* 프로필 아이콘 선택 */}
          <ProfileOptionList>
            {PROFILE_ICONS.map(({ id, Icon, SelectedIcon }) => (
              <IconButton key={id} onClick={() => setSelectedIcon(id)}>
                {selectedIcon === id
                  ? <SelectedIcon width={44} height={44} />
                  : <Icon width={44} height={44} />
                }
              </IconButton>
            ))}
          </ProfileOptionList>
        </ProfileSection>

        {/* 이름 입력 */}
        <InputName>
          <Label>이름</Label>
          <TextFieldBase
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요."
          />
        </InputName>

        {/* 자기소개 입력 */}
        <InputInfo>
          <Label>자기소개</Label>
          <TextFieldBase
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자기소개를 입력해주세요."
          />
        </InputInfo>
      </ContentWrapper>

      <BtnWrapper>
        <Btn
          text="다음"
          disabled={!canNext}
          variant={canNext ? 'primary' : 'primary50'}
          onClick={handleNext}
        />
      </BtnWrapper>
    </PageWrapper>
  );
}