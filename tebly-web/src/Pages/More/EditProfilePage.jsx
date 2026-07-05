import { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import TextFieldBase from '../../components/common/Textfield';
import Btn from '../../components/common/Btn';
import EditProfileImageIcon from '../../assets/icons/edit-profile-image.svg?react';
// TODO: 유저 프로필 정보 API 연동

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
  // TODO: API에서 유저 정보 받아와서 초기값으로 설정
  const [name, setName] = useState('김뿡치'); // TODO: 로그인된 유저 이름으로 대체
  const [bio, setBio] = useState(''); // TODO: 저장된 자기소개로 대체
  const navigate = useNavigate();

  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null); // TODO: 저장 시 이 File을 백엔드 업로드 API에 전달
  const fileInputRef = useRef(null);

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  }

  function handleSave() {
    console.log('저장:', { name, bio, profileImageFile });
    // TODO: 프로필 수정 API 연동 (profileImageFile은 FormData로 전송)
  }

  return (
    <PageWrapper>
      <Header
        title="프로필 수정"
        leftIcon="back"
        onLeft={() => navigate(-1)} // TODO: navigate(-1) 연동
      />

      <ContentWrapper>
        {/* 프로필 이미지 */}
        <ProfileImageWrapper>
          <ProfileImage>
            {/* TODO: 유저 프로필 이미지 API 연동 */}
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