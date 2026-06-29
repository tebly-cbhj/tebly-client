import styled from 'styled-components';
import Btn from '../common/Btn';

const Card = styled.div`
  display: flex;
  width: 350px;
  padding: 20px 20px 24px 20px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 20px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
  box-shadow: 0 4px 8px 0 rgba(21, 42, 38, 0.12);
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;

const RoomName = styled.span`
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
  align-self: stretch;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  align-self: stretch;
`;

const Description = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray800};
`;

const Inviter = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray800};
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RejectButtonWrapper = styled.div`
  width: 80px;
  height: 35px;
`;

const AcceptButtonWrapper = styled.div`
  width: 218px;
  height: 35px;
`;

export default function RoomInviteCard({ roomName, description, inviter, onReject, onAccept }) {
  return (
    <Card>
      <InfoContainer>
        <RoomName>{roomName}</RoomName>
        <DescriptionWrapper>
          <Description>{description}</Description>
          <Inviter>초대자: {inviter}</Inviter>
        </DescriptionWrapper>
      </InfoContainer>

      <ButtonRow>
        <RejectButtonWrapper>
          <Btn
            text="거절"
            size="small"
            variant="gray"
            onClick={onReject} // TODO: 방 초대 거절 API 연동
          />
        </RejectButtonWrapper>
        <AcceptButtonWrapper>
          <Btn
            text="수락"
            size="small"
            onClick={onAccept} // TODO: 방 초대 수락 API 연동
          />
        </AcceptButtonWrapper>
      </ButtonRow>
    </Card>
  );
}