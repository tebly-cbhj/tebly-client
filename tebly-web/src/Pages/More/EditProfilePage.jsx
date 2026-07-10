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
  padding: 8px 20px;
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
  const fileInputRef = useRef(null);

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    let profileImageUrl = myProfile?.profileImageUrl;

    if (profileImageFile) {
      const formData = new FormData();
      formData.append('file', profileImageFile);
      const uploadRes = await apiClient.post('/users/me/profile-image', formData);
      profileImageUrl = uploadRes.data.profileImageUrl;
    }

    await updateMyProfile({ nickname: name, profileImageUrl, bio });
    navigate(-1);
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