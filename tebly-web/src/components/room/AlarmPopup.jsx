import { useState } from 'react';
import styled from 'styled-components';
import Btn from '../common/Btn';

import DragHandleIcon from '../../assets/icons/drag-handle.svg?react';

const OPTIONS = ['5분 전', '10분 전', '30분 전', '1시간 전', '12시간 전', '1일 전'];

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
  height: 498px;
  border-radius: 32px 32px 0 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -4px 12px 0 rgba(68, 68, 68, 0.08);
`;

const DragHandleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;

  svg {
    display: block;
  }
`;

const OptionList = styled.div`
  margin-top: 24px;
  padding: 0 20px;
`;

const OptionItem = styled.button`
  display: flex;
  width: 100%;
  padding: 16px 0;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
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
`;

const ButtonWrapper = styled.div`
  width: 350px;
  margin: 18.5px auto 0;
`;

export default function AlarmPopup({ onClose, onSelect }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  function toggleOption(option) {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      }

      return [...prev, option];
    });
  }

  function handleConfirm() {
    onSelect?.(selectedOptions);
  }

  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <DragHandleWrapper>
          <DragHandleIcon />
        </DragHandleWrapper>

        <OptionList>
          {OPTIONS.map((option) => {
            const selected = selectedOptions.includes(option);

            return (
              <OptionItem
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
              >
                <OptionText $selected={selected}>{option}</OptionText>
              </OptionItem>
            );
          })}
        </OptionList>

        <ButtonWrapper>
          <Btn
            text="선택 완료"
            size="large"
            onClick={handleConfirm}
          />
        </ButtonWrapper>
      </Sheet>
    </Overlay>
  );
}