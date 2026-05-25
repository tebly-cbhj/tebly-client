import styled from 'styled-components';

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center; 
`;

const TabButton = styled.button`
  display: inline-flex;
  min-width: 166px;
  padding: 10px 10px 12px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: transparent;
  outline: none;
  cursor: pointer;

  ${(props) => props.theme.typography.s1}

  color: ${(props) => 
    props.$active 
      ? props.theme.colors.primary100 
      : props.theme.colors.gray500};

  border: none; 
  border-bottom: ${(props) => 
    props.$active 
      ? `1px solid ${props.theme.colors.primary100}` 
      : 'none'}; // 활성화 된 탭에게만 빨간색 밑줄 부여
`;

export default function TabBtn({ activeTab, onTabClick }) {
  return (
    <TabContainer>
      <TabButton 
        $active={activeTab === 'tab1'} 
        onClick={() => onTabClick('tab1')}
      >
        내 약속
      </TabButton>
      <TabButton 
        $active={activeTab === 'tab2'} 
        onClick={() => onTabClick('tab2')}
      >
        초대받은 약속
      </TabButton>
    </TabContainer>
  );
}