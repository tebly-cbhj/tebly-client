import styled from 'styled-components';

const Slot = styled.div`
  display: flex;
  width: 1.75rem;
  height: 2.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid ${({ $state, theme }) => {
    if ($state === 'error') return theme.colors.alert;
    if ($state === 'filled') return theme.colors.gray900;
    return theme.colors.gray500;
  }};
`;

const DigitText = styled.span`
  width: 100%;
  color: ${({ theme }) => theme.colors.gray900};
  text-align: center;
  font-family: 'Pretendard Variable';
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.04375rem;
`;

export default function DigitSlot({ value, error = false }) {
  const state = error ? 'error' : value ? 'filled' : 'empty';
  return (
    <Slot $state={state}>
      <DigitText>{value}</DigitText>
    </Slot>
  );
}
