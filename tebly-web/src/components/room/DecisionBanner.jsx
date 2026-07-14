import styled from 'styled-components';
import SparkleIcon from '../../assets/icons/sparkle.svg?react';

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 12px;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: var(--primary-color-primary10, #EFFFFB);
  box-sizing: border-box;
  margin-top: 0.75rem;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

const Text = styled.span`
  ${({ theme }) => theme.typography.caption1};
  color: ${({ theme }) => theme.colors.gray900};
`;

export default function DecisionBanner() {
  return (
    <Container>
      <IconWrapper>
        <SparkleIcon width={24} height={24} />
      </IconWrapper>
      <Text>결정이가 각자에게 초대장을 보냈어요</Text>
    </Container>
  );
}
