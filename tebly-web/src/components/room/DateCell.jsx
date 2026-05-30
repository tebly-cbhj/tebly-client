import styled from 'styled-components';

const CellWrapper = styled.button`
  position: relative;
  width: 3rem;
  height: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
  padding: 0;
  background: transparent;
  cursor: ${({ $state }) => $state === 'disabled' ? 'default' : 'pointer'};
  outline: none;
`;

const RangeBg = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 3rem;
  height: 2.5rem;
  pointer-events: none;
  background: ${({ $range, theme }) => {
    if ($range === 'start') return `linear-gradient(to right, transparent 50%, ${theme.colors.primary10} 50%)`;
    if ($range === 'end') return `linear-gradient(to right, ${theme.colors.primary10} 50%, transparent 50%)`;
    if ($range === 'full') return theme.colors.primary10;
    return 'transparent';
  }};
`;

const Circle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${({ $visible, theme }) => $visible ? theme.colors.primary100 : 'transparent'};
  pointer-events: none;
`;

const DateText = styled.span`
  position: relative;
  z-index: 1;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4rem;
  letter-spacing: -0.025rem;
  color: ${({ $state, theme }) => {
    if ($state === 'start' || $state === 'end') return theme.colors.white;
    return theme.colors.gray900;
  }};
`;

const TodayDot = styled.span`
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary100};
  z-index: 2;
`;

export default function DateCell({ date, state = 'default', isToday = false, onClick, onMouseEnter }) {
  const isSelected = state === 'start' || state === 'end';

  let rangeBg = 'none';
  if (state === 'start') rangeBg = 'start';
  else if (state === 'end') rangeBg = 'end';
  else if (state === 'in-range') rangeBg = 'full';

  return (
    <CellWrapper
      $state={state}
      onClick={state !== 'disabled' ? onClick : undefined}
      onMouseEnter={state !== 'disabled' ? onMouseEnter : undefined}
    >
      <RangeBg $range={rangeBg} />
      <Circle $visible={isSelected} />
      {state !== 'disabled' && <DateText $state={state}>{date}</DateText>}
      {isToday && !isSelected && <TodayDot />}
    </CellWrapper>
  );
}
