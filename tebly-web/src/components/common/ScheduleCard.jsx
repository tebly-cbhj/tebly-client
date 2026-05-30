import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  padding: 20px 20px 24px 20px;
  align-items: center;
  gap: 20px;
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary100};
  flex-shrink: 0;
  transform: translateY(2px);
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  padding-top: 20px;
  align-self: stretch;
`;

const Title = styled.span`
  color: ${({ theme }) => theme.colors.gray900};
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.45px;
`;

const SubText = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.35px;
`;

const ParticipantContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  align-self: stretch;
  margin-top: -8px; /* 텍스트 컨테이너랑 8px 겹치게 */
`;

const CountContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
`;

const MemberIcon = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${({ theme }) => theme.colors.gray500}; /* 아이콘 임시 */
  border-radius: 50%;
`;

const CountText = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.35px;
`;

const SliderTrack = styled.div`
  width: 250px;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.gray200};
  overflow: hidden;
`;

const SliderFill = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary100};
  width: ${({ $ratio }) => $ratio * 100}%;
  transition: width 0.3s ease;
`;

export default function ScheduleCard({ title, date, location, acceptedCount, totalCount }) {
  return (
    <Card>
      <Thumbnail />
      <RightSection>
        <Title>{title}</Title>
        <SubText>{date}</SubText>
        <SubText>{location}</SubText>
        <ParticipantContainer>
          <CountContainer>
            <MemberIcon />
            <CountText>{acceptedCount}/{totalCount}</CountText>
          </CountContainer>
          <SliderTrack>
            <SliderFill $ratio={acceptedCount / totalCount} />
          </SliderTrack>
        </ParticipantContainer>
      </RightSection>
    </Card>
  );
}