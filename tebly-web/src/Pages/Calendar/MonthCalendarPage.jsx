import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useScheduleStore } from '../../store/ScheduleStore';
import { usePersonalScheduleStore } from '../../store/PersonalScheduleStore';
import { PageWrapper } from '../../PageWrapper';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import WeekDayRow from '../../components/calendar/month/WeekDayRow';
import DateCell from '../../components/calendar/month/DateCell';
import CalendarFab from '../../components/calendar/CalendarFab';

const Container = styled.div`
  width: 390px;
  display: flex;
  flex-direction: column;
  background: transparent;
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 50px);
  justify-content: center;
`;

const WeekDivider = styled.div`
  grid-column: 1 / -1;
  width: 100%;
  height: 0.0625rem;
  background: var(--grayscale-gray-300, #DCDCDC);
`;

const FloatingWrapper = styled.div`
  position: fixed;
  bottom: 5rem;
  right: 1.25rem;
  z-index: 100;
`;

const CATEGORY_MAP = {
  약속: 'Appointment',
  동아리: 'Club',
  가족: 'Family',
  자기개발: 'SelfDevelopment',
  알바: 'Work',
  수업: 'Class',
  여가: 'Leisure',
  '팀 프로젝트': 'TeamProject',
  기타: 'Other',
};

function normalizeCategory(category) {
  const key = category && typeof category === 'object' ? category.categoryIcon : category;
  return CATEGORY_MAP[key] || key || 'Other';
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatMonthLabel(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}.${month}`;
}

function parseStoreDate(dateText) {
  const [datePart] = dateText.split(' ');
  const [year, month, day] = datePart.split('.').map(Number);

  return new Date(year, month - 1, day);
}

function isSameDate(a, b) {
  return formatDateKey(a) === formatDateKey(b);
}

function createMonthDates(currentMonthDate) {
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);

  const firstDay = firstDate.getDay();
  const lastDay = lastDate.getDay();

  const dates = [];

  for (let i = firstDay; i > 0; i -= 1) {
    dates.push(new Date(year, month, 1 - i));
  }

  for (let day = 1; day <= lastDate.getDate(); day += 1) {
    dates.push(new Date(year, month, day));
  }

  for (let i = 1; i < 7 - lastDay; i += 1) {
    dates.push(new Date(year, month + 1, i));
  }

  return dates;
}

function getScheduleStartDate(schedule) {
  return schedule.startDate || schedule.date;
}

function getDateRangeKeys(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(formatDateKey(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function expandScheduleDates(schedule) {
  const startDateText = getScheduleStartDate(schedule);
  const endDateText = schedule.endDate || startDateText;

  const startDate = parseStoreDate(startDateText);
  const endDate = parseStoreDate(endDateText);

  if (!schedule.repeat) {
    return getDateRangeKeys(startDate, endDate);
  }

  const dates = [];
  const currentStartDate = new Date(startDate);
  const currentEndDate = new Date(endDate);
  const untilDate = parseStoreDate(schedule.repeat.until);
  const interval = schedule.repeat.interval || 1;

  while (currentStartDate <= untilDate) {
    dates.push(...getDateRangeKeys(currentStartDate, currentEndDate));

    if (schedule.repeat.type === 'daily') {
      currentStartDate.setDate(currentStartDate.getDate() + interval);
      currentEndDate.setDate(currentEndDate.getDate() + interval);
    } else if (schedule.repeat.type === 'weekly') {
      currentStartDate.setDate(currentStartDate.getDate() + 7 * interval);
      currentEndDate.setDate(currentEndDate.getDate() + 7 * interval);
    } else if (schedule.repeat.type === 'monthly') {
      currentStartDate.setMonth(currentStartDate.getMonth() + interval);
      currentEndDate.setMonth(currentEndDate.getMonth() + interval);
    } else {
      break;
    }
  }

  return dates;
}

export default function MonthCalendarPage({ viewMode, onViewModeChange, selectedDate: initialSelectedDate, onDateChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  // TODO: GET /api/schedules (방 확정 일정) API 호출로 교체 — 현재 로컬 스토어 사용
  const confirmedSchedules = useScheduleStore((state) => state.schedules);
  const personalSchedules = usePersonalScheduleStore((state) => state.schedules);
  const fetchSchedules = usePersonalScheduleStore((state) => state.fetchSchedules);

  const today = useMemo(() => new Date(), []);

  const [currentMonthDate, setCurrentMonthDate] = useState(
    initialSelectedDate
      ? new Date(initialSelectedDate.year, initialSelectedDate.month - 1, initialSelectedDate.day)
      : today
  );

  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    const y = currentMonthDate.getFullYear();
    const m = String(currentMonthDate.getMonth() + 1).padStart(2, '0');
    fetchSchedules('monthly', `${y}-${m}-01`);
  }, [currentMonthDate, fetchSchedules]);

  // TODO: DB 연동 시 schedule ID로 상세 데이터를 API에서 fetch하도록 교체
  function handleScheduleClick(schedule) {
    const [startTime, endTime] = schedule.time ? schedule.time.split(' - ') : ['', ''];
    navigate('/calendar/event-detail', {
      state: {
        scheduleId: schedule.scheduleId,
        schedule: {
          title: schedule.label,
          memo: schedule.memo,
          startDate: schedule.date,
          startTime: startTime || '',
          endDate: schedule.date,
          endTime: endTime || '',
          place: schedule.place,
          category: schedule.originalCategory,
          alarmTime: schedule.alarmTime,
          repeat: schedule.repeat,
        },
      },
    });
  }

  const monthDates = useMemo(
    () => createMonthDates(currentMonthDate),
    [currentMonthDate]
  );

  // TODO: OCR 파싱으로 들어오는 불안정한 데이터 포맷에 대한 방어 예외 처리 추가
  const allSchedules = useMemo(() => {
    return [...confirmedSchedules, ...personalSchedules].flatMap((schedule) => {
      const scheduleDates = expandScheduleDates(schedule);

      return scheduleDates.map((date) => ({
        id: `${schedule.id}-${date}`,
        scheduleId: schedule.id,
        date,
        category: normalizeCategory(schedule.category),
        originalCategory: schedule.category,
        label: schedule.title,
        time: schedule.time,
        memo: schedule.memo || '',
        place: schedule.location || '',
        alarmTime: schedule.alarmTime || '',
        repeat: schedule.repeat ? `${schedule.repeat.type} 반복` : '반복 없음',
      }));
    });
  }, [confirmedSchedules, personalSchedules]);

  function getScheduleStartMinutes(timeText) {
    if (!timeText) return Number.MAX_SAFE_INTEGER;

    const [startTime] = timeText.split(' - ');
    const [hour, minute] = startTime.split(':').map(Number);

    return hour * 60 + minute;
  }

  const schedulesByDate = useMemo(() => {
    const grouped = allSchedules.reduce((acc, schedule) => {
      if (!acc[schedule.date]) {
        acc[schedule.date] = [];
      }

      acc[schedule.date].push(schedule);

      return acc;
    }, {});

    Object.keys(grouped).forEach((date) => {
      grouped[date].sort(
        (a, b) => getScheduleStartMinutes(a.time) - getScheduleStartMinutes(b.time)
      );
    });

    return grouped;
  }, [allSchedules]);

  return (
    <PageWrapper>
      <Container>
        <CalendarHeader
          monthLabel={formatMonthLabel(currentMonthDate)}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          hasUnreadNotification={false}
          onNotificationClick={() => console.log('알림 클릭')}
          onDateChange={(date) => {
            setCurrentMonthDate(new Date(date.year, date.month - 1, date.day));
            setSelectedDate(new Date(date.year, date.month - 1, date.day));
            onDateChange?.(date);
          }}
        />

        <WeekDayRow />

        <DateGrid>
          {monthDates.flatMap((date, index) => {
            const dateKey = formatDateKey(date);
            const isCurrentMonth =
              date.getMonth() === currentMonthDate.getMonth();
            const isSelected = isSameDate(date, selectedDate);

            let variant = 'default';

            if (!isCurrentMonth) {
              variant = 'muted';
            }

            if (isSelected) {
              variant = 'selected';
            }

            const cell = (
              <DateCell
                key={dateKey}
                date={date.getDate()}
                schedules={schedulesByDate[dateKey] || []}
                variant={variant}
                onClick={() => setSelectedDate(date)}
                onScheduleClick={handleScheduleClick}
              />
            );

            if ((index + 1) % 7 === 0 && index < monthDates.length - 1) {
              return [cell, <WeekDivider key={`divider-${index}`} />];
            }

            return [cell];
          })}
        </DateGrid>
      </Container>

      <FloatingWrapper>
        <CalendarFab
          initialOpen={location.state?.openFab ?? false}
          onDirectInput={() => navigate('/calendar/create')}
          onAiRecognition={(file) => navigate('/ocr-loading', { state: { imageFile: file } })}
        />
      </FloatingWrapper>
    </PageWrapper>
  );
}