import { useEffect } from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import ocrIcon from '../../assets/icons/OCR_icon.svg'; 
import { PageWrapper } from '../../PageWrapper';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.white};
  padding-top: 106px;
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.h1}
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0;
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 240px;
  height: 240px;
  margin-top: 56px;
`;

const Icon = styled.img`
  width: 100%;
  height: 100%;
  display: block;
`;

const Description = styled.p`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.colors.gray500};
  margin: 56px 0 0 0;
  text-align: center;
`;

function OCRLoadingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    // TODO: OCR 분석 API 연결
    // const fetchOcrResult = async () => {
    //   try {
    //     const response = await api.post('/schedule/ocr', { imageUrl });
    //     navigate('/calendar/ocr-result', { state: { schedule: response.data } });
    //   } catch (error) {
    //     // TODO: 실패 시 처리 (에러 페이지 이동, 토스트 노출 등)
    //   }
    // };
    // fetchOcrResult();

    // API 연결 전 임시: 2초 후 페이지 이동
    const timer = setTimeout(() => {
      navigate('/ocr-result');
    }, 2000);

    return () => clearTimeout(timer); // 언마운트 시 타이머 정리
  }, [navigate]);


  return (
    <PageWrapper>
        <Container>
      <Title>
        사진 속 일정을
        <br />
        불러오는 중이에요
      </Title>

      <IconWrapper>
        <Icon src={ocrIcon} alt="OCR 아이콘" />
      </IconWrapper>

      <Description>
        날짜, 시간, 장소를 확인하고
        <br />
        일정으로 정리하고 있어요.
      </Description>
    </Container>
    </PageWrapper>
  );
}

export default OCRLoadingPage;