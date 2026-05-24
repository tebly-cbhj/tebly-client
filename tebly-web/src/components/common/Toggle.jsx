import styled from 'styled-components';

const ToggleWrapper = styled.button`
  display: flex;
  align-items: center;
  width: 56px;
  height: 32px;
  padding: 4px;
  border-radius: 100px;
  cursor: pointer;

  // 테두리 색상
  border: 1px solid ${(props) => props.theme.colors.gray300};
  
  // 배경 색상
  background-color: ${(props) =>
    props.$isOn ? props.theme.colors.red100 : props.theme.colors.gray500};

  transition: all 0.3s ease-in-out;
`;

// 토글 원
const ToggleCircle = styled.div`
  width: 22px;
  height: 22px;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
  
  transition: all 0.3s ease-in-out;

  // 켜짐 상태면 오른쪽으로 이동
  transform: ${(props) => (props.$isOn ? 'translateX(24px)' : 'translateX(0)')};
`;

export default function Toggle({ isOn, onToggle }) {
  return (
    <ToggleWrapper $isOn={isOn} onClick={onToggle} type="button">
      <ToggleCircle $isOn={isOn} />
    </ToggleWrapper>
  );
}