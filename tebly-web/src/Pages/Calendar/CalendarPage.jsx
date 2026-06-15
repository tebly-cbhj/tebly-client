import { useState } from 'react';
import MonthCalendarPage from './MonthCalendarPage';
import WeekCalendarPage from './WeekCalendarPage';

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState('month');

  return viewMode === 'month'
    ? <MonthCalendarPage viewMode={viewMode} onViewModeChange={setViewMode} />
    : <WeekCalendarPage viewMode={viewMode} onViewModeChange={setViewMode} />;
}