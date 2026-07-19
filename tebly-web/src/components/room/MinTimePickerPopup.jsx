import { useState } from 'react';
import styled from 'styled-components';
import DragHandleIcon from '../../assets/icons/drag-handle.svg?react';
import Btn from '../common/Btn';
import MinTimePicker from '../common/MinTimePicker';

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
  width: 100%;
  max-width: 490px;
  border-radius: 32px 32px 0 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -4px 12px 0 rgba(68, 68, 68, 0.08);
  padding-bottom: 34px;
`;

const DragHandleWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 12px;
`;

const Title = styled.p`
  margin: 16px 0 0;
  text-align: center;
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
`;

const PickerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 28px;
  padding: 0 20px;
`;

const CancelWrapper = styled.div`
  width: 120px;
`;

const ConfirmWrapper = styled.div`
  flex: 1;
`;

export default function MinTimePickerPopup({ onClose, onConfirm, confirmText = '선택 완료', title }) {
  const [time, setTime] = useState({ hour: '01', minute: '00' });

  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <DragHandleWrapper>
          <DragHandleIcon />
        </DragHandleWrapper>

        {title && <Title>{title}</Title>}

        <PickerWrapper>
          <MinTimePicker value={time} onChange={setTime} />
        </PickerWrapper>

        <ButtonRow>
          <CancelWrapper>
            <Btn text="취소" size="medium" variant="gray" onClick={onClose} />
          </CancelWrapper>
          <ConfirmWrapper>
            <Btn
              text={confirmText}
              size="medium"
              onClick={() => onConfirm?.(time)}
            />
          </ConfirmWrapper>
        </ButtonRow>
      </Sheet>
    </Overlay>
  );
}
