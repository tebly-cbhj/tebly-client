import styled from 'styled-components';

const ProgressBarWrapper = styled.div`
  width: 100%;
  max-width: 350px;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray300};
  border-radius: 100px;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${({ $step, $total }) => ($step / $total) * 100}%;
  background: ${({ theme }) => theme.colors.primary100};
  border-radius: 100px;
  transition: width 0.3s ease;
`;

export default function ProgressBar({ step, total }) {
  return (
    <ProgressBarWrapper>
      <ProgressBarFill $step={step} $total={total} />
    </ProgressBarWrapper>
  );
}