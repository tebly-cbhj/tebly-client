import styled from 'styled-components';

const Cell = styled.div`
  width: 44px;
  height: 60px;  /* 그대로 — span 12로 60px 유지됨 */
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray300 : 'transparent'};
  cursor: pointer;
`;

export default function TimeSlotCell({ selected, onClick, style }) {
  return <Cell $selected={selected} onClick={onClick} style={style} />;
}