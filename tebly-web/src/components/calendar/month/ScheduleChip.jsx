import styled from 'styled-components';

const Chip = styled.button`
  width: 44px;
  height: 13px;
  border: none;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 4px;
  cursor: pointer;
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

const Text = styled.span`
    color: ${({ theme }) => theme.colors.gray900};
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    font-family: Pretendard;
    font-size: 8px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: -0.2px;
    white-space: nowrap;
`;

export default function ScheduleChip({ category, label, onClick }) {
  return (
    <Chip type="button" $category={category} onClick={onClick}>
      <Text>{label}</Text>
    </Chip>
  );
}