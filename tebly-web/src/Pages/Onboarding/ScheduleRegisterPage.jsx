import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import ProgressBar from '../../components/common/ProgressBar';
import Btn from '../../components/common/Btn';
import OnboardSmart from '../../assets/onboarding/onboard-smart.svg?react';

const ProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 12px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
`;

const Title = styled.p`
  ${({ theme }) => theme.typography.h2};
  color: #000;
  margin: 0;
  margin-top: 44px;
`;

const SubTitle = styled.p`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.colors.gray800};
  white-space: pre-line;
  margin: 0;
  margin-top: 4px;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 54px;
`;

const NoticeText = styled.p`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray500};
  margin: 0;
  margin-top: 5px;
  text-align: center;
  width: 100%;
`;

const BtnWrapper = styled.div`
  position: fixed;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 23px;
`;

const SkipText = styled.span`
  ${({ theme }) => theme.typography.btn2};
  color: ${({ theme }) => theme.colors.gray500};
  text-decoration: underline;
  cursor: pointer;
`;

export default function ScheduleRegisterPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Header
        leftIcon="back"
        onLeft={() => navigate(-1)}
      />

      <ProgressWrapper>
        <ProgressBar step={4} total={4} />
      </ProgressWrapper>

      <ContentWrapper>
        <Title>더 스마트한 약속 추천</Title>
        <SubTitle>{`테블리가 내 일정 패턴을 분석해\n더 나은 약속을 추천해요.`}</SubTitle>
      </ContentWrapper>

      <ImageWrapper>
        <OnboardSmart width={350} height={300} />
      </ImageWrapper>

      <NoticeText>*수집된 데이터는 약속 추천 외에 사용되지 않아요.</NoticeText>

      <BtnWrapper>
        <SkipText onClick={() => navigate('/')}> {/* TODO: 건너뛰기 클릭 시 메인 페이지로 이동 */}
          건너뛰기
        </SkipText>
        <Btn
          text="시간표 등록하러가기"
          onClick={() => navigate('/ocr-loading')} // TODO: OCR 로딩 페이지로 이동
        />
      </BtnWrapper>
    </PageWrapper>
  );
}