import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import ProgressBar from '../../components/common/ProgressBar';
import Btn from '../../components/common/Btn';
import OnboardMap from '../../assets/onboarding/onboard-map.svg?react';

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

const MapWrapper = styled.div`
  margin-top: 54px;
  width: 100%;
  display: flex;
  justify-content: center;
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

export default function LocationConsentPage() {
  const navigate = useNavigate();

  function handleAgree() {
    // TODO: 위치 정보 동의 API 연동
    navigate('/signup/schedule');
  }

  return (
    <PageWrapper>
      <Header
        leftIcon="back"
        onLeft={() => navigate(-1)}
      />

      <ProgressWrapper>
        <ProgressBar step={3} total={4} />
      </ProgressWrapper>

      <ContentWrapper>
        <Title>약속 장소를 추천해드릴게요.</Title>
        <SubTitle>{`현재 위치를 기반으로\n딱 맞는 장소를 찾아드려요.`}</SubTitle>
      </ContentWrapper>

      <MapWrapper>
        <OnboardMap width={390} height={300} />
      </MapWrapper>

      <BtnWrapper>
        <SkipText onClick={() => navigate('/signup/schedule')}> {/* TODO: 건너뛰기 클릭 시 메인 페이지로 이동 */}
          건너뛰기
        </SkipText>
        <Btn
          text="동의하고 다음으로"
          onClick={() => navigate('/signup/schedule')}
        />
      </BtnWrapper>
    </PageWrapper>
  );
}