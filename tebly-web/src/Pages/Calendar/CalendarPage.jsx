import MonthCalendarPage from './MonthCalendarPage';
import WeekCalendarPage from './WeekCalendarPage';
import { useCalendarViewStore } from '../../store/CalendarViewStore';

export default function CalendarPage() {
  const viewMode = useCalendarViewStore((state) => state.viewMode);
  const setViewMode = useCalendarViewStore((state) => state.setViewMode);
  const selectedDate = useCalendarViewStore((state) => state.selectedDate);
  const setSelectedDate = useCalendarViewStore((state) => state.setSelectedDate);

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