import styled from 'styled-components'; 

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 16px 10px;
  border: none;
  width: 100%;

  // small 버튼 높이, 둥글기, 폰트 조절
  height: ${(props) => props.$size === 'small' ? '33px' : '54px'};
  border-radius: ${(props) => props.$size === 'small' ? '8px' : '16px'};
  ${(props) => props.theme.typography[props.$size === 'small' ? 'btn3' : 'btn2']}
  
  
  background-color: ${(props) => 
    props.disabled ? props.theme.colors.red30 : props.theme.colors.red100};
  
  color: ${(props) => props.theme.colors.white};
  
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: opacity 0.2s ease-in-out;

  &:active {
    opacity: ${(props) => (props.disabled ? 1 : 0.8)};
  }
`;

// 기본 폰트는 btn1 - small size는 사용 시 사이즈 small이라는 것 명시 필요
export default function Btn({ text, onClick, disabled = false, size = 'large' }) {
  return (
    <StyledButton onClick={onClick} disabled={disabled} $size={size}>
      {text}
    </StyledButton>
  );
}