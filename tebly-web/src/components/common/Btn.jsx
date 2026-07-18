import styled from 'styled-components'; 

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: none;
  width: 100%;
  white-space: nowrap;

  height: ${(props) =>
    props.$size === 'small'
      ? '33px'
      : props.$size === 'medium'
        ? '44px'
        : '54px'};

  border-radius: ${(props) => props.$size === 'large' ? '16px' : '8px'};

  ${(props) => {
    const isSmall = props.$size === 'small';
    const key = props.disabled
      ? (isSmall ? 'btn4' : 'btn2')
      : (isSmall ? 'btn3' : 'btn1');
    return props.theme.typography[key];
  }};

  padding: ${(props) => props.$size === 'small' ? '8px 12px' : '16px 10px'};
  
  background-color: ${(props) => {
    if (props.$variant === 'primary50') return props.theme.colors.primary50;
    if (props.disabled) return props.theme.colors.primary30;
    if (props.$variant === 'gray') return props.theme.colors.gray200;
    if (props.$variant === 'white') return props.theme.colors.white;
    if (props.$variant === 'danger') return props.theme.colors.alert;
    return props.theme.colors.primary100;
  }};

  color: ${(props) => {
    if (props.$variant === 'gray') return props.theme.colors.gray800;
    if (props.$variant === 'white') return props.theme.colors.gray900;
    return props.theme.colors.white;
  }};
  
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: opacity 0.2s ease-in-out;

  &:active {
    opacity: ${(props) => (props.disabled ? 1 : 0.8)};
  }
`;

export default function Btn({
  text,
  onClick,
  disabled = false,
  size = 'large',
  variant = 'primary',
}) {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      $size={size}
      $variant={variant}
    >
      {text}
    </StyledButton>
  );
}