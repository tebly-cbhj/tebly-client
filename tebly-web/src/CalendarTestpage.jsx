import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './GlobalStyle';
import DateCell from './components/calendar/month/DateCell';
import { useState } from 'react';
import CalendarHeader from './components/calendar/CalendarHeader';

const mockSchedules = [
  { id: 1, category: 'Appointment', label: '약속' },
  { id: 2, category: 'Class', label: '수업' },
  { id: 3, category: 'TeamProject', label: '팀플' },
  { id: 4, category: 'Work', label: '알바' },
  { id: 5, category: 'Leisure', label: '여가' },
];

export default function DateTestpage() {
  const [viewMode, setViewMode] = useState('month');

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />

      <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <h2>캘린더 테스트 페이지</h2>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-start' }}>

          <div>
            <h3>달력</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <DateCell date={1} schedules={[]} />
              <DateCell date={2} schedules={mockSchedules.slice(0, 1)} />
              <DateCell date={3} schedules={mockSchedules.slice(0, 2)} />
              <DateCell date={4} schedules={mockSchedules.slice(0, 3)} />
              <DateCell date={5} schedules={mockSchedules} />
              <DateCell date={6} schedules={mockSchedules.slice(0, 3)} variant="selected" />
              <DateCell date={30} schedules={mockSchedules.slice(0, 2)} variant="muted" />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-start' }}>
            <div>
                <h3>CalendarHeader</h3>
                <CalendarHeader
                    monthLabel="2026.06"
                    viewMode={viewMode}
                    onMonthClick={() => console.log('월 선택 버튼 클릭')}
                    onViewModeChange={setViewMode}
                />
            </div>
        </div>
      </div>
    </ThemeProvider>
  );
}