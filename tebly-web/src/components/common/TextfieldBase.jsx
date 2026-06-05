import styled from 'styled-components';

export const FieldWrapper = styled.div`
  display: flex;
  width: ${({ $width }) => {
    return $width || '350px';
  }};
  height: 48px;
  padding: 12px;
  align-self: center;
  gap: 8px;
  box-sizing: border-box;

  border-radius: 8px;
  background: ${(props) => {
    return props.theme.colors.gray200;
  }};
  border: ${(props) => props.$focused 
    ? `1px solid ${props.theme.colors.gray800}` 
    : 'none'};
`;

export const FieldInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;

  ${(props) => props.theme.typography.body3}
  color: ${(props) => props.theme.colors.gray800};

  &::placeholder {
    color: ${(props) => props.theme.colors.gray500};
  }
`;