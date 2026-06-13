import styled from 'styled-components';

const ToggleContainer = styled.div`
  position: relative;
  display: flex;
  width: 72px;
  height: 26px;
  padding: 2px;
  align-items: center;
  box-sizing: border-box;
  border-radius: 20px;
  background: var(--grayscale-gray-200, #EFEFEF);
`;

const SelectedBackground = styled.div`
  position: absolute;
  top: 2px;
  left: ${({ $value }) => ($value === 'month' ? '2px' : '34px')};
  width: 36px;
  height: 22px;
  border-radius: 20px;
  background: var(--grayscale-white, #FEFEFE);
  transition: left 0.2s ease;
`;

const ToggleButton = styled.button`
  position: relative;
  z-index: 1;
  display: flex;
  width: 34px;
  height: 22px;
  padding: 0;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  border: none;
  background: transparent;
  cursor: pointer;
`;


const ToggleText = styled.span`
  ${({ $selected, theme }) =>
    $selected ? theme.typography.btn3 : theme.typography.btn4};

  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray900 : theme.colors.gray500};

  white-space: nowrap;
  text-align: center;
  
  position: relative;
  top: -0.5px;
  left: ${({ $label }) => $label === 'week' ? '-1px' : '0.7px'};
`;

export default function MonthWeekToggle({ value = 'month', onChange }) {
  return (
    <ToggleContainer>
        <SelectedBackground $value={value} />

        <ToggleButton
            type="button"
            onClick={() => onChange?.('month')}
        >
        <ToggleText $selected={value === 'month'} $label="month">월간</ToggleText>
        </ToggleButton>

        <ToggleButton
            type="button"
            onClick={() => onChange?.('week')}
        >
        <ToggleText $selected={value === 'week'} $label="week">주간</ToggleText>
        </ToggleButton>
    </ToggleContainer>
  );
}