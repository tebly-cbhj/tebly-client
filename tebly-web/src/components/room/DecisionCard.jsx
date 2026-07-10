import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DecisionCharacterIcon from '../../assets/icons/decision-character.svg?react';
import DecisionProfileIcon from '../../assets/icons/decision-character-profile.svg?react';
import Btn from '../common/Btn';

const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

function parseDecisionContent(content) {
  const match = content?.match(
    /(\d{2})\/(\d{2})\s*(\d{2}:\d{2})\s*~\s*\d{2}\/\d{2}\s*(\d{2}:\d{2})/
  );
  if (!match) return null;

  const [, month, day, startTime, endTime] = match;
  const date = new Date(new Date().getFullYear(), Number(month) - 1, Number(day));
  const dateLabel = `${Number(month)}월 ${Number(day)}일(${DAY_KO[date.getDay()]})`;

  const description = content
    .replace(/^\[결정이\]\s*/, '')
    .replace(/결정이가\s*\d{2}\/\d{2}\s*\d{2}:\d{2}\s*~\s*\d{2}\/\d{2}\s*\d{2}:\d{2}로 약속을 제안했어요!\s*/, '')
    .replace(/^결정이가 추천해요!\s*/, '')
    .trim();

  return { dateLabel, timeRange: `${startTime} ~ ${endTime}`, description };
}

const Row = styled.div`
  display: inline-flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const ProfileWrapper = styled.div`
  width: 2.375rem;
  height: 2.375rem;
  flex-shrink: 0;
`;

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
`;

const SenderName = styled.span`
  ${({ theme }) => theme.typography.btn3};
  color: ${({ theme }) => theme.colors.gray800};
`;

const Card = styled.div`
  display: flex;
  width: 246px;
  padding: 20px 20px 24px 20px;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  border-radius: 20px;
  border: 1px solid var(--grayscale-gray-300, #DCDCDC);
  background: var(--grayscale-white, #FEFEFE);
  box-sizing: border-box;
`;

const CharacterWrapper = styled.div`
  width: 133.851px;
  height: 99.161px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
`;

const TimeText = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray900};

  strong {
    color: ${({ theme }) => theme.colors.primary100};
  }
`;

const DescText = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray800};
`;

const BtnWrapper = styled.div`
  width: 206px;
`;

export default function DecisionCard({ content }) {
  const navigate = useNavigate();
  const parsed = parseDecisionContent(content);

  return (
    <Row>
      <ProfileWrapper>
        <DecisionProfileIcon width="100%" height="100%" />
      </ProfileWrapper>
      <ContentColumn>
        <SenderName>결정이</SenderName>
        <Card>
          <CharacterWrapper>
            <DecisionCharacterIcon />
          </CharacterWrapper>
          <TextArea>
            {parsed ? (
              <>
                <TimeText>
                  결정이의 추천 시간은
                  <br />
                  <strong>{parsed.dateLabel} {parsed.timeRange}</strong> 입니다.
                </TimeText>
                {parsed.description && <DescText>{parsed.description}</DescText>}
              </>
            ) : (
              <DescText>{content?.replace(/^\[결정이\]\s*/, '')}</DescText>
            )}
          </TextArea>
          <BtnWrapper>
            <Btn text="초대장 확인하기" size="small" onClick={() => navigate('/noti-invitaion')} />
          </BtnWrapper>
        </Card>
      </ContentColumn>
    </Row>
  );
}
