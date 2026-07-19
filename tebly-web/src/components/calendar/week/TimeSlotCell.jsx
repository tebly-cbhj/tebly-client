import styled from 'styled-components';

const Cell = styled.div`
  width: 44px;
  height: ${({ $cellHeight }) => $cellHeight}px;
  border-right: 1px solid ${({ theme }) => theme.colors.gray300};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  border-top: ${({ $isFirstRow, theme }) => $isFirstRow ? `1px solid ${theme.colors.gray300}` : 'none'};
  border-left: ${({ $isFirstCol, theme }) => $isFirstCol ? `1px solid ${theme.colors.gray300}` : 'none'};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray300 : 'transparent'};
  cursor: pointer;
`;

export default function TimeSlotCell({ selected, onClick, style, isFirstRow, isFirstCol }) {
  return (
    <Cell
      $selected={selected}
      $isFirstRow={isFirstRow}
      $isFirstCol={isFirstCol}
      onClick={onClick}
      style={style}
    />
  );
}