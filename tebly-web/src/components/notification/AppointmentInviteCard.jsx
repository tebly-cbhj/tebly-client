import styled from 'styled-components';
import Btn from '../common/Btn';
import { CATEGORY_ICONS } from '../room/CategoryIcons';

const Card = styled.div`
  display: flex;
  width: 350px;
  padding: 20px 20px 24px 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
  box-shadow: 0 4px 8px 0 rgba(21, 42, 38, 0.12);
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  align-self: stretch;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
`;

const AppointmentName = styled.span`
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
`;

const DetailText = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray800};
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: stretch;
`;

const RejectButtonWrapper = styled.div`
  width: 80px;
  height: 35px;
`;

const AcceptButtonWrapper = styled.div`
  width: 218px;
  height: 35px;
`;

export default function AppointmentInviteCard({
  appointmentName,
  date,
  time,
  location,
  roomName,
  categoryId,
  onReject,
  onAccept,
}) {
  const categoryIcon = CATEGORY_ICONS.find((c) => c.id === categoryId);
  const Icon = categoryIcon?.Icon;

  return (
    <Card>
      <TopRow>
        <IconWrapper>
          {Icon && <Icon width={80} height={80} />}
        </IconWrapper>

        <TextContainer>
          <AppointmentName>{appointmentName}</AppointmentName>
          <DetailWrapper>
            <DetailText>{`${date} ${time}`}</DetailText>
            <DetailText>약속 장소: {location}</DetailText>
            <DetailText>From.{roomName}</DetailText>
          </DetailWrapper>
        </TextContainer>
      </TopRow>

      <ButtonRow>
        <RejectButtonWrapper>
          <Btn
            text="거절"
            size="small"
            variant="gray"
            onClick={onReject} // TODO: 약속 초대 거절 API 연동
          />
        </RejectButtonWrapper>
        <AcceptButtonWrapper>
          <Btn
            text="수락"
            size="small"
            onClick={onAccept} // TODO: 약속 초대 수락 API 연동
          />
        </AcceptButtonWrapper>
      </ButtonRow>
    </Card>
  );
}