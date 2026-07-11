import styled from 'styled-components';
import AnalyzingImage from '../../assets/icons/analyzing-image.svg?react';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  z-index: 999;
`;

const Title = styled.h2`
  color: var(--grayscale-gray-900, #1A1A1A);
  text-align: center;
  font-family: 'Pretendard Variable';
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.04375rem;
  white-space: pre-line;
  margin: 0;
`;

const Subtitle = styled.p`
  color: var(--grayscale-gray-500, #A3A3A3);
  text-align: center;
  font-family: 'Pretendard Variable';
  font-size: 1rem;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.025rem;
  white-space: pre-line;
  margin: 0;
`;

export default function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null;

  return (
    <Overlay>
      <Title>{'약속 가능한 시간을\n분석하고 있어요'}</Title>
      <AnalyzingImage />
      <Subtitle>{'설정한 기간 안에서 가능한\n약속 시간을 추천해 드릴게요.'}</Subtitle>
    </Overlay>
  );
}
