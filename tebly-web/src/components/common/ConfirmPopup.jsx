import styled from 'styled-components';
import Btn from './Btn';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const Box = styled.div`
  width: 300px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.white};
  padding: 28px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.p`
  margin: 0 0 24px;
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
  text-align: center;
  white-space: pre-line;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  flex: 1;
`;

export default function ConfirmPopup({
  visible,
  title,
  cancelText = '취소',
  confirmText = '확인',
  danger = false,
  onCancel,
  onConfirm,
}) {
  if (!visible) return null;

  return (
    <Overlay onClick={onCancel}>
      <Box onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <ButtonRow>
          <ButtonWrapper>
            <Btn text={cancelText} variant="gray" size="medium" onClick={onCancel} />
          </ButtonWrapper>
          <ButtonWrapper>
            <Btn
              text={confirmText}
              variant={danger ? 'danger' : 'primary'}
              size="medium"
              onClick={onConfirm}
            />
          </ButtonWrapper>
        </ButtonRow>
      </Box>
    </Overlay>
  );
}
