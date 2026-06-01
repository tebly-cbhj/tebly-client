import { useState } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  display: inline-flex;
  padding: 0 0.25rem;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
`;

const Label = styled.span`
  ${({ theme }) => theme.typography.btn2}
  color: ${({ theme }) => theme.colors.gray900};
  text-align: center;
`;

const TriangleIcon = styled.svg`
  width: 0.5rem;
  height: 0.5rem;
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
`;

export default function SortButton({ text = '정렬', onClick }) {
  const [isAsc, setIsAsc] = useState(false);

  function handleClick(e) {
    setIsAsc(v => !v);
    onClick?.(e);
  }

  return (
    <Button onClick={handleClick}>
      <Label>{text}</Label>
      <TriangleIcon viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        {isAsc
          ? <path d="M3.46387 0L6.92797 6H-0.000234365L3.46387 0Z" fill="#1A1A1A"/>
          : <path d="M3.46387 6L6.92797 0H-0.000234365L3.46387 6Z" fill="#1A1A1A"/>
        }
      </TriangleIcon>
    </Button>
  );
}
