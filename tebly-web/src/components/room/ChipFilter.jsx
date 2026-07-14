//import { useState } from 'react';
import styled from 'styled-components';

const ChipWrapper = styled.div`
  display: inline-flex;
  padding: 0.5rem 0.75rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 1.25rem;
  border: 1px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.primary50 : theme.colors.gray300};
  box-shadow: ${({ $selected, theme }) =>
    $selected ? `inset 0 0 0 1px ${theme.colors.primary50}` : 'none'};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.white : theme.colors.gray100};
  cursor: pointer;
`;

const ChipText = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 0.75rem;
  font-style: normal;
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  line-height: 140%;
  letter-spacing: -0.01875rem;
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary100 : theme.colors.gray800};
`;

export default function ChipFilter({ text = '', selected = false, onClick }) {
  return (
    <ChipWrapper $selected={selected} onClick={onClick}>
      <ChipText $selected={selected}>{text}</ChipText>
    </ChipWrapper>
  );
}
