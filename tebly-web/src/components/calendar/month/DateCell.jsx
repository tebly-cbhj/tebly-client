import styled from 'styled-components';
import ScheduleChip from './ScheduleChip';

const Cell = styled.button`
  display: flex;
  width: 50px;
  height: 100px;
  padding: 8px 2px;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  border: none;
  background-color: ${({ $variant, theme }) =>
    $variant === 'selected' ? theme.colors.gray300 : 'transparent'};
  cursor: pointer;
`;

const DateContainer = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateText = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ $variant, theme }) => {
    if ($variant === 'selected') return theme.colors.primary100;
    if ($variant === 'muted') return theme.colors.gray500;
    return theme.colors.gray900;
  }};
`;

const ChipList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export default function DateCell({ date, schedules = [], variant = 'default', onClick, onScheduleClick }) {
  const visible = schedules.slice(0, 3);
  const remaining = schedules.length - 3;

  return (
    <Cell type="button" $variant={variant} onClick={onClick}>
      <DateContainer>
        <DateText $variant={variant}>{date}</DateText>
      </DateContainer>

      <ChipList>
        {visible.map((schedule) => (
          <ScheduleChip
            key={schedule.id}
            category={schedule.category}
            label={schedule.label}
            onClick={(e) => {
              e.stopPropagation();
              onScheduleClick?.(schedule);
            }}
          />
        ))}

        {remaining > 0 && (
          <ScheduleChip category="More" label={`+${remaining}`} />
        )}
      </ChipList>
    </Cell>
  );
}