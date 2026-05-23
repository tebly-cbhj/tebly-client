import { useState } from 'react';
import styled from 'styled-components';
import TriangleIconSvg from '../../assets/icons/triangle.svg?react';

const ChipWrapper = styled.div`
  display: inline-flex;
  padding: 8px 10px;
  justify-content: center;
  align-items: center;
  gap: 2px;
  border-radius: 16px;
  background: ${(props) => props.theme.colors.gray300};
  cursor: pointer; 
`;

const ChipText = styled.span`
  ${(props) => props.theme.typography.btn4}
  color: ${(props) => props.theme.colors.gray900};
`;

const TriangleIcon = styled(TriangleIconSvg)`
  width: 8px;
  height: 6px;
  flex-shrink: 0;
  
  // 열림 상태(isOpen)면 180도 회전, 닫힘 상태면 기존 상태 유지
  transform: ${(props) => props.$isOpen 
    ? 'rotate(180deg)' 
    : 'translateY(1px)'};
`;

export default function Chip({ text = '월간', onClick }) {
  // 열림 / 닫힘 상태 구분
  const [isOpen, setIsOpen] = useState(false);

  // 클릭마다 열림 / 닫힘 반전
  const handleClick = (e) => {
    setIsOpen(!isOpen); 
    if (onClick) onClick(e);
  };

  return (
    <ChipWrapper onClick={handleClick}>
      <ChipText>{text}</ChipText>
      <TriangleIcon $isOpen={isOpen} />
    </ChipWrapper>
  );
}