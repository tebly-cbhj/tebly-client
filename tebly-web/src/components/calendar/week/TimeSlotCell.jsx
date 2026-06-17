import styled from 'styled-components';

const Cell = styled.div`
  width: 44px;
  height: ${({ $cellHeight }) => $cellHeight}px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray300 : 'transparent'};
  cursor: pointer;
`;

export default function TimeSlotCell({ selected, onClick, style }) {
  return <Cell $selected={selected} onClick={onClick} style={style} />;
}