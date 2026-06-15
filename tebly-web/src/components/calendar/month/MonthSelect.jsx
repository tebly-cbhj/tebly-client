import styled from 'styled-components';
import ChevronDown from '../../../assets/icons/chevron-down.svg?react';

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0px;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const Text = styled.span`
  color: {({ theme }) => theme.colors.gray900};
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
`;

const Icon = styled(ChevronDown)`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  position: relative;
  top: 1px;
`;

export default function MonthSelectButton({ label = '2026.06', onClick }) {
  return (
    <Button type="button" onClick={onClick}>
      <Text>{label}</Text>
      <Icon />
    </Button>
  );
}