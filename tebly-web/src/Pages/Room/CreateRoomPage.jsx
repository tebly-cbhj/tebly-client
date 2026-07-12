import { useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import RoomCover from "../../components/room/RoomCover";
import Textfield from "../../components/common/Textfield";
import { PageWrapper } from '../../PageWrapper';
import Btn from "../../components/common/Btn";
import ActionSheet from "../../components/common/ActionSheet";
import Header from "../../components/common/Header";
import { useRoomStore } from "../../store/RoomStore";


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
  margin-top: 202px;
  width: 350px;
  align-self: center;
`;

const CreateRoom = () => {
  const location = useLocation();
  const editRoomId = location.state?.roomId;
  const [roomName, setRoomName] = useState(location.state?.name ?? "");
  const [description, setDescription] = useState(location.state?.description ?? "");
  const [imageUrl, setImageUrl] = useState(location.state?.imageUrl ?? null);
  const [sheetVisible, setSheetVisible] = useState(false);
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


  return (
    <PageWrapper style={{ alignItems: 'center' }}>
      <Header
        title={editRoomId ? "방 수정하기" : "방 만들기"}
        leftIcon="back"
        onLeft={() => navigate(-1)}
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
            text="다음"
            disabled={!isActive}
            onClick={() => navigate('/select-friend', { state: { roomName, description, imageUrl, roomId: editRoomId } })}
          />
        </BtnWrapper>
      </ContentArea>

      <ActionSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        option1Text="기본 커버 이미지"
        option2Text="앨범에서 선택"
        onOption1={() => {
          setImageUrl(null);
          setSheetVisible(false);
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
    </PageWrapper>
  );
};

export default CreateRoom;
