import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import RoomCover from "../../components/common/RoomCover";
import TextField from "../../components/common/TextField";
import { PageWrapper } from '../../PageWrapper';
import Btn from "../../components/common/Btn";
import ActionSheet from "../../components/common/ActionSheet";
import Header from "../../components/common/Header";

// 헤더 아래 16px 간격
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
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [sheetVisible, setSheetVisible] = useState(false);
  const isActive = roomName.trim() !== "" && description.trim() !== "";
  const navigate = useNavigate();
  

  return (
    <PageWrapper style={{ alignItems: 'center' }}>
      <Header 
        title="방 만들기"
        leftIcon="chevron-left"
        onLeft={() => navigate(-1)}
        icons={[]}
      />
      <ContentArea>
        <RoomCover onClick={() => setSheetVisible(true)} />

        <FieldContainer>
          <FieldLabel>방 이름</FieldLabel>
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="방 이름을 입력해 주세요."
          />
        </FieldContainer>

        <FieldContainer>
          <FieldLabel>한 줄 소개</FieldLabel>
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="한 줄 소개를 입력해 주세요."
          />
        </FieldContainer>

        <BtnWrapper>
          <Btn
            text="다음"
            disabled={!isActive}
            onClick={() => navigate('/select-friend', { state: { roomName, description } })}
          />
        </BtnWrapper>
      </ContentArea>

      <ActionSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        option1Text="기본 커버 이미지"
        option2Text="앨범에서 선택"
        onOption1={() => setSheetVisible(false)}
        onOption2={() => setSheetVisible(false)}
      />
    </PageWrapper>
  );
};

export default CreateRoom;
