import { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import TextFieldBase from '../../components/common/Textfield';
import Btn from '../../components/common/Btn';
import EditProfileImageIcon from '../../assets/icons/edit-profile-image.svg?react';
import { useFriendStore } from '../../store/FriendStore';
import apiClient from '../../api/client';

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
  align-items: center;
  width: 100%;
  margin-top: 12px;
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
  background: ${({ theme }) => theme.colors.gray300};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

const InputName = styled.div`
  display: flex;
  width: 100%;
  padding: 8px 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  box-sizing: border-box;
  margin-top: 24px;
`;

const InputInfo = styled(InputName)`
  margin-top: 0;
`;

const Label = styled.span`
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
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

const SaveButtonWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 440px;
`;

export default function EditProfilePage() {
  const myProfile = useFriendStore((state) => state.myProfile);
  const updateMyProfile = useFriendStore((state) => state.updateMyProfile);
  const navigate = useNavigate();

  const [name, setName] = useState(myProfile?.nickname ?? '');
  const [bio, setBio] = useState(myProfile?.bio ?? '');

  const [profileImagePreview, setProfileImagePreview] = useState(myProfile?.profileImageUrl ?? null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const fileInputRef = useRef(null);

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedIcon(null);
    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfileImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleIconSelect(icon) {
    setSelectedIcon(icon.id);
    setProfileImageFile(null);
    setProfileImagePreview(icon.url);
  }

  async function handleSave() {
    let profileImageUrl = myProfile?.profileImageUrl;

    try {
      if (selectedIcon) {
        profileImageUrl = PROFILE_ICONS.find((icon) => icon.id === selectedIcon)?.url;
      } else if (profileImageFile) {
        const formData = new FormData();
        formData.append('file', profileImageFile);
        const uploadRes = await apiClient.post('/users/me/profile-image', formData);
        // 서버가 { profileImageUrl } 객체 대신 URL 문자열만 내려주는 경우까지 방어
        profileImageUrl = uploadRes.data?.profileImageUrl ?? uploadRes.data;
      }

      await updateMyProfile({ nickname: name, profileImageUrl, bio });
      navigate(-1);
    } catch (err) {
      alert(err.message || '프로필 저장에 실패했어요. 다시 시도해주세요.');
    }
  }

  return (
    <PageWrapper>
      <Header
        title="프로필 수정"
        leftIcon="back"
        onLeft={() => navigate(-1)}
      />

      <ContentWrapper>
        {/* 프로필 이미지 */}
        <ProfileImageWrapper>
          <ProfileImage>
            {profileImagePreview && <img src={profileImagePreview} alt="프로필 미리보기" />}
          </ProfileImage>
          <EditIconWrapper onClick={() => fileInputRef.current.click()}>
            <EditProfileImageIcon width={56} height={56} />
          </EditIconWrapper>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />
        </ProfileImageWrapper>

        {/* 기본 프로필 아이콘 선택 */}
        <ProfileOptionList>
          {PROFILE_ICONS.map((icon) => (
            <IconButton key={icon.id} onClick={() => handleIconSelect(icon)}>
              {selectedIcon === icon.id
                ? <icon.SelectedIcon width={44} height={44} />
                : <icon.Icon width={44} height={44} />
              }
            </IconButton>
          ))}
        </ProfileOptionList>

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

      {/* 저장 버튼 */}
      <SaveButtonWrapper>
        <Btn
          text="저장"
          size="large"
          onClick={handleSave}
        />
      </SaveButtonWrapper>
    </PageWrapper>
  );
}