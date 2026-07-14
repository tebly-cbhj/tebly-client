import { useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import RoomCover from "../../components/room/RoomCover";
import Textfield from "../../components/common/Textfield";
import { PageWrapper } from '../../PageWrapper';
import Btn from "../../components/common/Btn";
import ActionSheet from "../../components/common/ActionSheet";
import DefaultCoverPage from "../../components/room/DefaultCoverPage";
import Header from "../../components/common/Header";
import { useRoomStore } from "../../store/RoomStore";
import apiClient from "../../api/client";


const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
`;

// RoomName / Description 컨테이너
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  gap: 12px;   
`;

const FieldLabel = styled.span`
  align-self: stretch;
  color: ${(props) => props.theme.colors.gray900};

  ${({ theme }) => theme.typography.s1}
`;

const BtnWrapper = styled.div`
  position: fixed;
  left: 50%;
  bottom: 21px;
  transform: translateX(-50%);
  width: 350px;
`;

const CreateRoom = () => {
  const location = useLocation();
  const editRoomId = location.state?.roomId;
  const [roomName, setRoomName] = useState(location.state?.name ?? "");
  const [description, setDescription] = useState(location.state?.description ?? "");
  const [imageUrl, setImageUrl] = useState(location.state?.imageUrl ?? null);
  const selectedMembers = location.state?.selectedMembers ?? [];
  const [sheetVisible, setSheetVisible] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const isActive = roomName.trim() !== "" && description.trim() !== "";
  const navigate = useNavigate();
  const uploadRoomImage = useRoomStore((state) => state.uploadRoomImage);
  const fileInputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const url = await uploadRoomImage(file);
      setImageUrl(url);
    } catch {
      alert('이미지 업로드에 실패했어요. 다시 시도해주세요.');
    }
  }

  async function handleNext() {
    if (editRoomId) {
      // 수정 모드: 친구 초대는 별도 기능이라 여기선 이름/소개/이미지만 바로 저장
      try {
        await apiClient.patch(`/rooms/${editRoomId}`, {
          name: roomName,
          description,
          imageUrl,
        });
        navigate(-1);
      } catch {
        alert('방 정보 수정에 실패했어요. 다시 시도해주세요.');
      }
    } else {
      navigate('/select-friend', { state: { roomName, description, imageUrl, selectedMembers } });
    }
  }


  return (
    <PageWrapper style={{ alignItems: 'center' }}>
      <Header
        title={editRoomId ? "방 수정하기" : "방 만들기"}
        leftIcon="back"
        onLeft={() => (editRoomId ? navigate(-1) : navigate('/room-list'))}
        icons={[]}
      />
      <ContentArea>
        <RoomCover imageUrl={imageUrl} onClick={() => setSheetVisible(true)} />

        <FieldContainer>
          <FieldLabel>방 이름</FieldLabel>
          <Textfield
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="방 이름을 입력해 주세요."
          />
        </FieldContainer>

        <FieldContainer>
          <FieldLabel>한 줄 소개</FieldLabel>
          <Textfield
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="한 줄 소개를 입력해 주세요."
          />
        </FieldContainer>

        <BtnWrapper>
          <Btn
            text={editRoomId ? "완료" : "다음"}
            disabled={!isActive}
            onClick={handleNext}
          />
        </BtnWrapper>
      </ContentArea>

      <ActionSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        option1Text="기본 커버 이미지"
        option2Text="앨범에서 선택"
        onOption1={() => {
          setSheetVisible(false);
          setShowCoverPicker(true);
        }}
        onOption2={() => {
          setSheetVisible(false);
          fileInputRef.current?.click();
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {showCoverPicker && (
        <DefaultCoverPage
          onClose={() => setShowCoverPicker(false)}
          onSelect={({ url }) => {
            setImageUrl(url);
            setShowCoverPicker(false);
          }}
        />
      )}
    </PageWrapper>
  );
};

export default CreateRoom;
