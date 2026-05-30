import styled from 'styled-components';
import { useState } from 'react';

// 화면 배경
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
`;

// 액션 시트 컨테이너
const SheetContainer = styled.div`
  padding: 16px 20px 32px 20px;
  width: 100%;
  box-sizing: border-box; 
`;

// 버튼을 묶는 그룹
const ActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.gray200};
  overflow: hidden;
`;

// 각 버튼 스타일
const ActionButton = styled.button`
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;

  // 클릭 효과
  &:hover, &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

// 상단 버튼 텍스트
const ActionText = styled.span`
  ${({ theme }) => theme.typography.btn2};
  color: ${({ selected, theme }) => 
    selected ? theme.colors.primary100 : theme.colors.gray900};
`;

// 하단 버튼 텍스트
const CancelText = styled(ActionText)`
  ${({ theme }) => theme.typography.btn1};
  color: ${(props) => props.theme.colors.gray800};
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.colors.gray300 || '#DEDEDE'};
`;


const CancelGroup = styled(ActionGroup)`
  margin-top: 12px;
`;

export default function ActionSheet({ visible, onClose, onOption1, onOption2, option1Text, option2Text }) {
  const [selected, setSelected] = useState(null);

  if (!visible) return null;

  return (
    <Overlay onClick={onClose}>
      <SheetContainer onClick={(e) => e.stopPropagation()}>
        
        <ActionGroup>
          <ActionButton onClick={() => { setSelected('option1'); onOption1?.(); }}>
            <ActionText selected={selected === 'option1'}>{option1Text}</ActionText>  {/* ← 수정 */}
          </ActionButton>
          <Divider />
          <ActionButton onClick={() => { setSelected('option2'); onOption2?.(); }}>
            <ActionText selected={selected === 'option2'}>{option2Text}</ActionText>  {/* ← 수정 */}
          </ActionButton>
        </ActionGroup>

        <CancelGroup>
          <ActionButton onClick={onClose}>
            <CancelText>취소</CancelText>
          </ActionButton>
        </CancelGroup>

      </SheetContainer>
    </Overlay>
  );
}