import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 21.875rem;
  align-items: center;
  gap: 0.25rem;
`;

const InputWrapper = styled.div`
  display: flex;
  height: 2.375rem;
  padding: 0.75rem;
  align-items: center;
  gap: 0.5rem;
  flex: 1 0 0;
  border-radius: 0.5rem;
  background: var(--grayscale-gray-200, #efefef);
`;

const Input = styled.input`
  display: flex;
  align-items: center;
  flex: 1 0 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: Pretendard, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.02188rem;
  color: inherit;

  &::placeholder {
    color: #a3a3a3;
  }
`;

const SendButton = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: none;
  background: transparent;
  padding: 0;
  cursor: ${({ $active }) => ($active ? 'pointer' : 'default')};
`;

export default function MessageInput({ value, onChange, onSend }) {
  const isActive = value.length > 0;
  const iconFill = isActive ? '#34BAA0' : '#DCDCDC';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isActive) onSend();
  };

  return (
    <Container>
      <InputWrapper>
        <Input
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
        />
      </InputWrapper>
      <SendButton $active={isActive} onClick={isActive ? onSend : undefined}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M2.53904 4.06728C2.39007 3.26285 3.2175 2.62932 3.95505 2.98329L29.1933 15.0985C29.9497 15.4616 29.9497 16.5382 29.1933 16.9013L3.95505 29.0155C3.21755 29.3695 2.39023 28.7369 2.53904 27.9325L4.41199 17.8178C4.49977 17.3438 4.91321 16.9999 5.39528 16.9999H12.5176C13.0696 16.9997 13.5175 16.552 13.5176 15.9999C13.5176 15.4477 13.0697 15.0001 12.5176 14.9999H5.39528C4.91322 14.9999 4.49977 14.656 4.41199 14.182L2.53904 4.06728Z"
            fill={iconFill}
          />
        </svg>
      </SendButton>
    </Container>
  );
}
