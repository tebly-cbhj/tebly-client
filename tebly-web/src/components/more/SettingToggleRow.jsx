import styled from 'styled-components';
import Toggle from '../common/Toggle';

const Row = styled.div`
  display: flex;
  width: 100%;
  padding: 12px 0;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
`;

const Label = styled.span`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray900};
  flex: 1 0 0;
`;

export default function SettingToggleRow({ label, isOn, onToggle }) {
  return (
    <Row>
      <Label>{label}</Label>
      <Toggle isOn={isOn} onToggle={onToggle} />
    </Row>
  );
}