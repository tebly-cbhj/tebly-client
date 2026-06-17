import styled from 'styled-components';
import Btn from '../common/Btn';

import DragHandleIcon from '../../assets/icons/drag-handle.svg?react';

const REPEAT_OPTIONS = ['없음', '매일', '매주', '매월', '매년'];

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  z-index: 9999;
  align-items: center;
`;

const Sheet = styled.div`
  width: 390px;
  border-radius: 32px 32px 0 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -4px 12px 0 rgba(68, 68, 68, 0.08);
  padding-bottom: 2rem;
`;

const DragHandleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 14px;

  svg {
    display: block;
  }
`;

const OptionList = styled.div`
  margin-top: 24px;
  padding: 0 1.25rem;
`;

const OptionRow = styled.button`
  display: flex;
  height: 3.5rem;
  padding: 1rem 0;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  &:last-child {
    border-bottom: none;
  }
`;

const OptionText = styled.span`
  ${({ $selected, theme }) =>
    $selected ? theme.typography.s2 : theme.typography.body2};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray900 : theme.colors.gray500};
  text-align: center;
`;

const CheckSvg = () => (
  <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 5L7 11L19 1" stroke="#34BAA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ButtonWrapper = styled.div`
  width: 350px;
  margin: 18.5px auto 0;
`;

export default function RepeatPopup({ selected = '없음', onClose, onSelect }) {
  function handleSelect(option) {
    onSelect?.(option);
  }

  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <DragHandleWrapper>
          <DragHandleIcon />
        </DragHandleWrapper>

        <OptionList>
          {REPEAT_OPTIONS.map((option) => {
            const isSelected = option === selected;
            return (
              <OptionRow key={option} type="button" onClick={() => handleSelect(option)}>
                <OptionText $selected={isSelected}>{option}</OptionText>
                {isSelected && <CheckSvg />}
              </OptionRow>
            );
          })}
        </OptionList>

        <ButtonWrapper>
          <Btn text="선택 완료" size="large" onClick={onClose} />
        </ButtonWrapper>
      </Sheet>
    </Overlay>
  );
}
