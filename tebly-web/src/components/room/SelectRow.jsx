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

export default function SelectRow({
  LeftIcon = null,   // 아이콘 컴포넌트를 직접 받음 (예: PlaceIcon)
  right_icon = false,
  text_empty = '',
  text_selected = '',
  text_typing = '',
  state = 'empty',
  onClick,
}) {
  const text =
    state === 'selected' ? text_selected :
    state === 'typing'   ? text_typing   :
                           text_empty;

  return (
    <Row onClick={onClick}>
      {LeftIcon && <IconWrapper><LeftIcon /></IconWrapper>}
      <Label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text $state={state}>{text}</Text>
          {state === 'typing' && <Cursor />}
        </div>
      </Label>
      {right_icon && <IconWrapper><ChevronRightIcon /></IconWrapper>}
    </Row>
  );
}
