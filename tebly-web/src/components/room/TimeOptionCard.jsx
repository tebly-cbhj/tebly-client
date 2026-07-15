import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  width: 21.875rem;
  padding: 1rem 1.25rem;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.75rem;
  background: #FEFEFE;
  outline: ${({ $selected, theme }) => $selected ? `2px solid ${theme.colors.primary50}` : 'none'};
  outline-offset: -2px;
  cursor: pointer;
`;

const DateBlock = styled.div`
  display: flex;
  width: 3.75rem;
  height: 3.5rem;
  padding-bottom: 0.25rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const DateNumber = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: ${({ $selected, theme }) => $selected ? theme.colors.gray900 : theme.colors.gray800};
  text-align: center;
`;

const DayName = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  color: ${({ $selected, theme }) => $selected ? theme.colors.gray900 : theme.colors.gray800};
  text-align: center;
  align-self: stretch;
`;

const Divider = styled.div`
  width: 2px;
  height: 56px;
  background: ${({ theme }) => theme.colors.gray200};
  flex-shrink: 0;
`;

const OptionInfo = styled.div`
  display: flex;
  padding-left: 0.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0;
  flex: 1 0 0;
  align-self: stretch;
`;

const TimeInfo = styled.div`
  align-self: stretch;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const TimeText = styled.span`
  color: ${({ $selected, theme }) => $selected ? theme.colors.primary100 : '#1A1A1A'};
  font-family: 'Pretendard Variable';
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.02188rem;
`;

const MemberCount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  align-self: stretch;
  margin-top: -0.5rem;
  cursor: pointer;
`;

const CountRow = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
`;

const CountText = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 14px;
  font-weight: 400;
  line-height: 19.6px;
  color: ${({ theme }) => theme.colors.gray500};
`;

const ProgressTrack = styled.div`
  height: 0.5rem;
  align-self: stretch;
  background: ${({ theme }) => theme.colors.gray200};
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $ratio }) => Math.min($ratio, 1) * 100}%;
  background: ${({ theme }) => theme.colors.gray500};
`;

function ClockIcon({ selected }) {
  const stroke = selected ? '#34BAA0' : '#1A1A1A';
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.5rem', height: '1.5rem' }}>
      <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2"/>
      <path d="M12 8V12L16 14.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MemberIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip_member)">
        <circle cx="8" cy="4.8" r="2.4" fill="#A3A3A3" stroke="#A3A3A3" strokeWidth="1.6"/>
        <path d="M9.4 9.6C12.162 9.6 14.4 11.839 14.4 14.6C14.4 15.815 13.415 16.8 12.2 16.8H3.8C2.586 16.8 1.6 15.815 1.6 14.6C1.6 11.839 3.839 9.6 6.6 9.6H9.4Z" fill="#A3A3A3" stroke="#A3A3A3" strokeWidth="1.6"/>
      </g>
      <defs>
        <clipPath id="clip_member">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export default function TimeOptionCard({ date, dayOfWeek, timeRange, memberCount, totalCount, selected = false, onClick, onAttendeeClick }) {
  return (
    <Card $selected={selected} onClick={onClick}>
      <DateBlock>
        <DateNumber $selected={selected}>{date}</DateNumber>
        <DayName $selected={selected}>{dayOfWeek}</DayName>
      </DateBlock>

      <Divider />

      <OptionInfo>
        <TimeInfo>
          <ClockIcon selected={selected} />
          <TimeText $selected={selected}>{timeRange}</TimeText>
        </TimeInfo>
        <MemberCount>
          <CountRow
            onClick={(e) => {
              if (!onAttendeeClick) return;
              e.stopPropagation();
              onAttendeeClick();
            }}
          >
            <MemberIcon />
            <CountText>{memberCount}/{totalCount}</CountText>
          </CountRow>
          <ProgressTrack>
            <ProgressFill $ratio={memberCount / totalCount} />
          </ProgressTrack>
        </MemberCount>
      </OptionInfo>
    </Card>
  );
}
