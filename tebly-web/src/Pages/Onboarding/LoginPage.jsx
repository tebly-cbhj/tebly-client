import styled from 'styled-components';
import AppTypo from '../../assets/onboarding/app-typo.svg?react';
import AppLogo from '../../assets/onboarding/app-logo.svg?react';
import KakaoIcon from '../../assets/onboarding/kakao.png';
import GoogleIcon from '../../assets/onboarding/google.png';

import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.bg};
`;

const KakaoBtn = styled.button`
  display: flex;
  width: 100%;
  height: 54px;
  padding: 0 24px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  background: #FEE500;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

const GoogleBtn = styled.button`
  display: flex;
  width: 100%;
  height: 54px;
  padding: 0 24px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

const KakaoText = styled.span`
  color: rgba(0, 0, 0, 0.85);
  font-family: "Apple SD Gothic Neo";
  font-size: 15px;
  font-weight: 600;
  line-height: 150%;
`;

const GoogleText = styled(KakaoText)``;

const BtnWrapper = styled.div`
  width: calc(100% - 40px);
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SubTitle = styled.h3`
  ${({ theme }) => theme.typography.h3};
  color: ${({ theme }) => theme.colors.gray800};
  margin: 0;
  text-align: center;
`;

const InquiryText = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

function handleKakaoLogin() {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
}

function handleGoogleLogin() {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
}


export default function LoginPage() {
  return (
    <Wrapper>
      <div style={{ marginTop: '110px' }}>
        <AppTypo width={155.137} height={59.895} />
      </div>

      <div style={{ marginTop: '11.67px' }}>
        <SubTitle>시간표로 자유롭게 연결되다</SubTitle>
      </div>

      <div style={{ marginTop: '40px' }}>
        <AppLogo width={178} height={186.115} />
      </div>

      <div style={{ marginTop: '140px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <BtnWrapper>
            <KakaoBtn onClick={handleKakaoLogin}>
                <img src={KakaoIcon} width={20} height={20} alt="kakao" />
                <KakaoText>카카오로 시작하기</KakaoText>
            </KakaoBtn>

            <GoogleBtn onClick={handleGoogleLogin}>
                <img src={GoogleIcon} width={20} height={20} alt="google" />
                <GoogleText>구글로 시작하기</GoogleText>
            </GoogleBtn>

            <InquiryText>로그인에 문제가 있으신가요?</InquiryText> {/* TODO: 문의 페이지 연동 */}
        </BtnWrapper>
      </div>
    </Wrapper>
  );
}