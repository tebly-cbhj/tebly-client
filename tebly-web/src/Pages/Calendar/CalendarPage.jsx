import { useState } from 'react';
import MonthCalendarPage from './MonthCalendarPage';
import WeekCalendarPage from './WeekCalendarPage';

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });

  return viewMode === 'month'
    ? <MonthCalendarPage
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
    : <WeekCalendarPage
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />;
}