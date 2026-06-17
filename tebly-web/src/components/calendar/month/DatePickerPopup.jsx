import { useState } from 'react';
import styled from 'styled-components';
import DatePicker from './DatePicker';
import Btn from '../../common/Btn';
import DragHandleIcon from '../../../assets/icons/drag-handle.svg?react';

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
  align-items: center;
  z-index: 9999;
`;

const Sheet = styled.div`
  width: 390px;
  height: 362px;
  border-radius: 32px 32px 0 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -4px 12px 0 rgba(68, 68, 68, 0.08);
`;

const DragHandleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;

const PickerWrapper = styled.div`
  margin-top: 42px;
  display: flex;
  justify-content: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 40px;
  padding: 0 20px;
`;

const CancelButtonWrapper = styled.div`
  width: 120px;
`;

const ConfirmButtonWrapper = styled.div`
  width: 204px;
`;

export default function DatePickerPopup({ onClose, onConfirm, initialDate }) { // initialDate 추가
  console.log('DatePickerPopup 마운트, initialDate:', initialDate);
  const today = new Date();
  const [date, setDate] = useState(
    initialDate ?? {  // 직전 날짜 있으면 그걸로, 없으면 오늘
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    }
  );

  function handleConfirm() {
    onConfirm?.(date);
    onClose?.();
  }

  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <DragHandleWrapper>
          <DragHandleIcon />
        </DragHandleWrapper>

        <PickerWrapper>
          <DatePicker value={date} onChange={setDate} />
        </PickerWrapper>

        <ButtonRow>
          <CancelButtonWrapper>
            <Btn
              text="취소"
              size="medium"
              variant="gray"
              onClick={onClose}
            />
          </CancelButtonWrapper>

          <ConfirmButtonWrapper>
            <Btn
              text="선택 완료"
              size="medium"
              onClick={handleConfirm}
            />
          </ConfirmButtonWrapper>
        </ButtonRow>
      </Sheet>
    </Overlay>
  );
}