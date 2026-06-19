import styled from 'styled-components';

const Block = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 4px;
  align-items: flex-start;
  gap: 10px;
  border-radius: 4px;
  background-color: ${({ $category, theme }) => {
    const colorMap = {
      Appointment: theme.colors.secondaryred,
      Club: theme.colors.secondaryorange,
      Family: theme.colors.secondaryyellow,
      SelfDevelopment: theme.colors.secondarygreen,
      Work: theme.colors.secondaryblue,
      Class: theme.colors.secondarypurple,
      Leisure: theme.colors.secondarypink,
      TeamProject: theme.colors.secondarygray,
      Other: theme.colors.secondarymint,
    };
    return colorMap[$category] || 'transparent';
  }};
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.gray900};
  font-family: Pretendard;
  font-size: 8px;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.2px;
  word-break: keep-all;  /* 단어 단위로 줄바꿈 */
  overflow-wrap: break-word;  /* 단어가 너무 길면 강제 줄바꿈 */
  margin: 0;
`;

export default function ScheduleBlock({ category, text, onClick }) {
  return (
    <Block $category={category} onClick={onClick}>
      <Text>{text}</Text>
    </Block>
  );
}