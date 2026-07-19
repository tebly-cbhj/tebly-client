import styled from 'styled-components';
import Btn from '../common/Btn';
import { CATEGORY_ICONS } from '../room/CategoryIcons';
import SparkleIcon from '../../assets/icons/sparkle.svg?react';

const Card = styled.div`
  display: flex;
  width: 350px;
  padding: 20px 20px 24px 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  border-radius: 12px;
  background: ${({ theme, $isFromDecisionBot }) =>
    $isFromDecisionBot ? theme.colors.primary10 : theme.colors.white};
  box-sizing: border-box;
  box-shadow: 0 4px 8px 0 rgba(21, 42, 38, 0.12);
  position: relative;
`;

const SparkleWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 24px;
  height: 24px;
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
  min-width: 0;
  /* 결정이 카드일 때 우상단 반짝이 아이콘과 제목이 겹치지 않도록 여유 공간 확보 */
  padding-right: ${({ $isFromDecisionBot }) => ($isFromDecisionBot ? '28px' : '0')};
  box-sizing: border-box;
`;

const AppointmentName = styled.span`
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
  overflow-wrap: break-word;
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

const ConflictText = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray900};
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
  isFromDecisionBot = false,
  conflictMessage,
}) {
  const categoryIcon = CATEGORY_ICONS.find((c) => c.id === categoryId);
  const Icon = categoryIcon?.Icon;

  return (
    <Card $isFromDecisionBot={isFromDecisionBot}>
      {isFromDecisionBot && (
        <SparkleWrapper>
          <SparkleIcon width={24} height={24} />
        </SparkleWrapper>
      )}

      <TopRow>
        <IconWrapper>
          {Icon && <Icon width={80} height={80} />}
        </IconWrapper>

        <TextContainer $isFromDecisionBot={isFromDecisionBot}>
          <AppointmentName>{appointmentName}</AppointmentName>
          <DetailWrapper>
            <DetailText>{`${date} ${time}`}</DetailText>
            <DetailText>약속 장소: {location}</DetailText>
            <DetailText>From.{roomName}</DetailText>
          </DetailWrapper>
        </TextContainer>
      </TopRow>

      {conflictMessage && <ConflictText>{conflictMessage}</ConflictText>}

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