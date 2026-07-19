import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import MarkdownText from '../common/MarkdownText';
import CloseIcon from '../../assets/icons/close-m.svg?react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  z-index: 9999;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100%;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  outline: none;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  flex-shrink: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const HeaderTitle = styled.span`
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
`;

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
`;

export default function TermsDetailOverlay({ title, content, onClose }) {
  const sheetRef = useRef(null);

  useEffect(() => {
    sheetRef.current?.focus();

    // 안드로이드(RN 웹뷰) 뒤로가기 제스처가 앱 자체를 뒤로 넘기지 않고
    // 이 오버레이만 닫도록, history 엔트리를 하나 쌓아두고 popstate로 감지한다
    window.history.pushState({ termsOverlay: true }, '');
    const handlePopState = () => onClose?.();
    window.addEventListener('popstate', handlePopState);

    function handleKeyDown(e) {
      if (e.key === 'Escape') handleClose();
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    if (window.history.state?.termsOverlay) {
      window.history.back();
    } else {
      onClose?.();
    }
  }

  return (
    <Overlay onClick={handleClose}>
      <Sheet
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <HeaderRow>
          <HeaderTitle>{title}</HeaderTitle>
          <CloseButton onClick={handleClose} aria-label="닫기">
            <CloseIcon width={24} height={24} />
          </CloseButton>
        </HeaderRow>

        <Content>
          <MarkdownText content={content} />
        </Content>
      </Sheet>
    </Overlay>
  );
}
