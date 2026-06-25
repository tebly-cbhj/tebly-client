import styled from 'styled-components';

const Wrapper = styled.div`
  width: 350px;
  height: 40px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.gray200};
  display: flex;
  align-items: center;
  padding: 4px;
  box-sizing: border-box;
`;

const Tab = styled.div`
  flex: 1 0 0;
  height: 32px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.white : 'transparent'};
`;

const TabText = styled.span`
  ${({ $selected, theme }) =>
    $selected ? theme.typography.s2 : theme.typography.body2};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray900 : theme.colors.gray800};
`;

export default function ToggleBtn({ value, onChange, leftLabel = '방', rightLabel = '약속' }) {
  return (
    <Wrapper>
      <Tab
        $selected={value === 'left'}
        onClick={() => onChange('left')}
      >
        <TabText $selected={value === 'left'}>{leftLabel}</TabText>
      </Tab>
      <Tab
        $selected={value === 'right'}
        onClick={() => onChange('right')}
      >
        <TabText $selected={value === 'right'}>{rightLabel}</TabText>
      </Tab>
    </Wrapper>
  );
}