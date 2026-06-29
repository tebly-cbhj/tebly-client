import styled from 'styled-components';
import MemberIcon from '../../assets/icons/member.svg?react';
import ChipFilter from './ChipFilter';

const Card = styled.div`
  display: flex;
  width: 390px;
  padding: 20px 20px 24px 20px;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  opacity: 0.8;
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary10};
  flex-shrink: 0;
  transform: translateY(2px);
  overflow: hidden;

  svg {
    width: 80px;
    height: 80px;
    display: block;
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  align-self: stretch;
`;

const Title = styled.span`
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
`;

const SubText = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray500};
`;

const ParticipantContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  align-self: stretch;
  margin-top: -8px;
`;

const CountContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
`;

const CountText = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray500};
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

const ChipWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

export default function ScheduleCard({
  title,
  date,
  location,
  acceptedCount,
  totalCount,
  CategoryImage,
  chipLabel,
  onClick,
}) {
  const ratio = totalCount > 0 ? acceptedCount / totalCount : 0;

  return (
    <Card onClick={onClick}>
      <Thumbnail>
        {CategoryImage && <CategoryImage />}
      </Thumbnail>

      <RightSection>
        <Title>{title}</Title>
        <SubText>{date}</SubText>
        <SubText>{location}</SubText>

        <ParticipantContainer>
          <CountContainer>
            <MemberIcon />
            <CountText>
              {acceptedCount}/{totalCount}
            </CountText>
          </CountContainer>

          <SliderTrack>
            <SliderFill $ratio={ratio} />
          </SliderTrack>
        </ParticipantContainer>
      </RightSection>

      {chipLabel && (
        <ChipWrapper>
          <ChipFilter text={chipLabel} />
        </ChipWrapper>
      )}
    </Card>
  );
}