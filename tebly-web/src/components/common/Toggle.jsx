import styled from 'styled-components';

const ToggleWrapper = styled.button`
  display: flex;
  align-items: center;
  width: 2.75rem;
  height: 1.5rem;
  padding: 0.25rem;
  gap: 0.625rem;
  border-radius: 6.25rem;
  cursor: pointer;

  border: 1px solid var(--grayscale-gray-300, ${(props) => props.theme.colors.gray300});

  background-color: ${(props) =>
    props.$isOn ? props.theme.colors.primary100 : 'var(--grayscale-gray-500, #A3A3A3)'};

  transition: all 0.3s ease-in-out;
`;

const ToggleCircle = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;

  transition: all 0.3s ease-in-out;

  transform: ${(props) => (props.$isOn ? 'translateX(20px)' : 'translateX(0)')};
`;

export default function Toggle({ isOn, onToggle }) {
  return (
    <ToggleWrapper $isOn={isOn} onClick={onToggle} type="button">
      <ToggleCircle $isOn={isOn} />
    </ToggleWrapper>
  );
}