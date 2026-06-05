import styled from 'styled-components';
import ChevronRightIcon from '../../assets/icons/chevron-right.svg?react';

const Row = styled.div`
  display: flex;
  width: 21.875rem;
  padding: 1.25rem 0;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;
`;

const Text = styled.span`
  color: ${({ $state, theme }) =>
    $state === 'empty' ? theme.colors.gray800 : theme.colors.gray900};
  font-family: Pretendard, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.025rem;
`;

const Cursor = styled.div`
  width: 0.0625rem;
  height: 1rem;
  background: var(--grayscale-gray-800, #525252);
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  color: ${({ theme }) => theme.colors.gray900};
  font-family: Pretendard, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.025rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray800};
  }
`;

export default function SelectRow({
  LeftIcon = null,
  right_icon = false,
  text_empty = '',
  text_selected = '',
  text_typing = '',
  state = 'empty',
  value = '',
  onClick,
  onChange,
  onBlur,
  onKeyDown,
}) {
  const text =
    state === 'selected' ? text_selected :
    state === 'typing'   ? text_typing   :
                           text_empty;

  return (
    <Row onClick={onClick}>
      {LeftIcon && <IconWrapper><LeftIcon /></IconWrapper>}
      <Label>
        {state === 'typing' ? (
          <Input
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            autoFocus
            placeholder={text_empty}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <Text $state={state}>{text}</Text>
        )}
      </Label>
      {right_icon && <IconWrapper><ChevronRightIcon /></IconWrapper>}
    </Row>
  );
}
