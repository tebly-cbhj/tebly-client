import styled from 'styled-components';
import RadioBtn from '../../common/RadioBtn'; 


const CardContainer = styled.div`
  display: flex;
  width: 100%; 
  height: 88px;
  min-height: 88px;
  padding: 20px;
  align-items: center;
  gap: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
  
  /* 선택 상태에 따른 테두리 분기 처리 */
  border: ${({ $isSelected, theme }) => 
    $isSelected ? `2px solid ${theme.colors.primary100}` : '2px solid transparent'};
  
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`;

const IconWrapper = styled.div`
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  flex: 1 0 0; /* 남은 공간을 모두 차지하도록 설정 */
`;

const Title = styled.span`
  ${({ theme }) => theme.typography.s2}
  
  /* 선택 상태에 따른 타이틀 색상 분기 처리 */
  color: ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primary100 : theme.colors.gray900};
`;

const TimeText = styled.span`
  ${({ theme }) => theme.typography.body3}
  color: ${({ theme }) => theme.colors.gray800};
`;

export default function ScheduleCard({
  title,
  time,
  categoryIcon,
  isSelected,
  onBodyClick,
  onRadioClick,
}) {
  return (
    <CardContainer $isSelected={isSelected} onClick={onBodyClick}>
      <IconWrapper>
        {categoryIcon}
      </IconWrapper>

      <TextContainer>
        <Title $isSelected={isSelected}>{title}</Title>
        <TimeText>{time}</TimeText>
      </TextContainer>

      <div onClick={(e) => { e.stopPropagation(); onRadioClick?.(); }}>
        <RadioBtn selected={isSelected} />
      </div>
    </CardContainer>
  );
}