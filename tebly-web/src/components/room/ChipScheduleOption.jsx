import styled from 'styled-components';

const Chip = styled.div`
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 6.25rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const Text = styled.span`
  ${({ theme }) => theme.typography.btn2}
  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10H21V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10Z" stroke="#A3A3A3" strokeWidth="2"/>
      <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V10H3V7Z" stroke="#A3A3A3" strokeWidth="2"/>
      <path d="M8 3V7" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 3V7" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="7" y="13" width="2" height="2" rx="1" fill="#A3A3A3"/>
      <rect x="11" y="13" width="2" height="2" rx="1" fill="#A3A3A3"/>
      <rect x="15" y="13" width="2" height="2" rx="1" fill="#A3A3A3"/>
    </svg>
  );
}

export default function ChipScheduleOption({ text }) {
  return (
    <Chip>
      <CalendarIcon />
      <Text>{text}</Text>
    </Chip>
  );
}
