import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { PageWrapper } from '../../PageWrapper';
import TimeOptionCard from '../../components/room/TimeOptionCard';
import LoadingOverlay from '../../components/room/LoadingOverlay';
import Btn from '../../components/common/Btn';
import ChipScheduleOption from '../../components/room/ChipScheduleOption';
import SortButton from '../../components/common/SortButton';
import OptionItem from '../../components/room/OptionItem';
import DateCell from '../../components/room/DateCell';
import Header from '../../components/common/Header';
import AttendeePopup from '../../components/room/AttendeePopup';
import apiClient from '../../api/client';
import MagicWandIcon from '../../assets/icons/magicwand.svg?react';

// ─── 페이지 레이아웃 ────────────────────────────────────────────

const FilterBar = styled.div`
  display: flex;
  width: 24.375rem;
  padding: 0.5rem 1.25rem;
  justify-content: space-between;
  align-items: center;
`;

const CardList = styled.div`
  display: flex;
  width: 24.375rem;
  padding: 0 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding-bottom: 6rem;
  margin-top: 0.875rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 80px 20px 0;
  text-align: center;
`;

const EmptyTitle = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.s2};
  color: ${({ theme }) => theme.colors.gray900};
`;

const EmptySubtext = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray500};
`;

const BottomArea = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 480px;
  padding: 0.75rem 1.25rem 2.125rem;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectBtnWrapper = styled.div`
  width: 17.5rem; /* 280px */
`;

const MagicWandBtn = styled.button`
  display: flex;
  width: 3.875rem; /* 62px */
  height: 3.375rem; /* 54px */
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  border-radius: 0.75rem;
  border: 2px solid var(--grayscale-gray-300, #DCDCDC);
  background: var(--grayscale-white, #FEFEFE);
  padding: 0;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }

  svg {
    width: 2.5rem;
    height: auto;
    aspect-ratio: 24 / 41.875;
  }
`;

// ─── 공용 시트 요소 ─────────────────────────────────────────────

const Dim = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.30);
  z-index: 100;
`;

const Handle = styled.div`
  width: 3rem;
  height: 0.3125rem;
  background: var(--grayscale-gray-300, #dcdcdc);
  border-radius: 6.25rem;
  margin: 0.75rem 0 0;
  flex-shrink: 0;
`;

// ─── 정렬 시트 ──────────────────────────────────────────────────

const SortSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24.375rem;
  height: 20.8125rem;
  border-radius: 2rem 2rem 0 0;
  background: var(--grayscale-white, #fefefe);
  z-index: 101;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SortHandle = styled(Handle)`
  margin: 0.75rem 0 1.5rem;
`;

const SortTitle = styled.span`
  ${({ theme }) => theme.typography.s1}
  color: ${({ theme }) => theme.colors.gray900};
  text-align: center;
  margin-bottom: 1.25rem;
`;

const SortOptionList = styled.div`
  display: flex;
  flex-direction: column;
  width: 21.875rem;
`;

const SortDivider = styled.div`
  width: 100%;
  height: 0.03125rem;
  background: #dcdcdc;
`;

const SORT_OPTIONS = [
  { value: 'recommended', label: '추천순' },
  { value: 'longest',     label: '여유시간순' },
  { value: 'earliest',   label: '빠른 시간순' },
  { value: 'latest',     label: '늦은 시간순' },
];

const SORT_VALUE_TO_API_TYPE = {
  recommended: 'RECOMMENDED',
  longest: 'LONGEST',
  earliest: 'EARLIEST',
  latest: 'LATEST',
};

// ─── 날짜 선택 시트 ─────────────────────────────────────────────

const DateSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24.375rem;
  height: 33.6875rem;
  background: #fefefe;
  border-radius: 2rem 2rem 0 0;
  box-shadow: 0px -4px 12px rgba(68, 68, 68, 0.08);
  z-index: 101;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DateHandle = styled(Handle)`
  margin: 0.75rem auto 0;
`;

const CalendarArea = styled.div`
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 1.69rem;
  overflow: hidden;
`;

const MonthHeader = styled.div`
  display: flex;
  width: 21rem;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.25rem;
`;

const MonthLabel = styled.span`
  ${({ theme }) => theme.typography.h3}
  color: ${({ theme }) => theme.colors.gray900};
`;

const NavBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const DayHeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 3rem);
  margin-bottom: 0.25rem;
`;

const DayLabel = styled.div`
  width: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.typography.body3}
  color: ${({ theme }) => theme.colors.gray500};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 3rem);
`;

const DateButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0 1.25rem 2.125rem;
  margin-top: 0.75rem;
  flex-shrink: 0;
`;

const ResetBtn = styled.button`
  display: flex;
  width: 7.5rem;
  height: 2.75rem;
  padding: 1rem 0.625rem;
  justify-content: center;
  align-items: center;
  
  border-radius: 0.5rem;
  border: none;
  background: ${({ theme }) => theme.colors.gray200};
  ${({ theme }) => theme.typography.btn1}
  color: ${({ theme }) => theme.colors.gray800};
  cursor: pointer;
  
`;

const ConfirmBtn = styled.button`
  display: flex;
  width: 12.75rem;
  height: 2.75rem;
  padding: 1rem 0.625rem;
  justify-content: center;
  align-items: center;
  
  border-radius: 0.5rem;
  border: none;
  background: ${({ theme }) => theme.colors.primary100};
  ${({ theme }) => theme.typography.btn1}
  color: #fefefe;
  cursor: pointer;
`;

// ─── 시간 조정 다이얼 (선택한 추천 시간의 시작/종료를 원형으로 드래그해 미세 조정) ──

const DIAL_SIZE = 350;
const DIAL_CENTER = DIAL_SIZE / 2;
// 링 두께가 바뀌면 반지름도 항상 같은 비율로 같이 커지고 작아지게 함
const RING_WIDTH = 30;
const RADIUS_TO_WIDTH_RATIO = 120 / 34;
const RING_RADIUS = RING_WIDTH * RADIUS_TO_WIDTH_RATIO + 4;
const RING_INNER_RADIUS = RING_RADIUS - RING_WIDTH / 2;
const TICK_RING_GAP = 8;
const TICK_LENGTH = 8;
const TICK_LABEL_GAP = 16;
const TICK_OUTER_RADIUS = RING_INNER_RADIUS - TICK_RING_GAP;
const TICK_INNER_RADIUS = TICK_OUTER_RADIUS - TICK_LENGTH;
const LABEL_RADIUS = TICK_INNER_RADIUS - TICK_LABEL_GAP;
const HANDLE_R = 12;
const HANDLE_TOUCH_R = 24;
const TIME_STEP_MINUTES = 30;
const DEFAULT_MIN_GAP_MINUTES = 30;
const BOUND_PADDING_MINUTES = 0;
const MINUTES_PER_DAY = 24 * 60;

function minutesToAngle(minutes) {
  return (minutes / MINUTES_PER_DAY) * 360;
}

function angleToMinutes(angle) {
  const normalized = ((angle % 360) + 360) % 360;
  return (normalized / 360) * MINUTES_PER_DAY;
}

function snapMinutes(minutes) {
  const snapped = Math.round(minutes / TIME_STEP_MINUTES) * TIME_STEP_MINUTES;
  return ((snapped % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
}

// 시계 방향, 12시 방향을 0도로 하는 각도를 다이얼 중심 기준 좌표로 변환
function polarPoint(radius, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: DIAL_CENTER + radius * Math.sin(rad),
    y: DIAL_CENTER - radius * Math.cos(rad),
  };
}

function describeArc(radius, startAngle, endAngle) {
  const start = polarPoint(radius, startAngle);
  const end = polarPoint(radius, endAngle);
  const diff = ((endAngle - startAngle) % 360 + 360) % 360;
  const largeArcFlag = diff > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

function formatHourTickLabel(hour24) {
  if (hour24 === 0) return '12am';
  if (hour24 === 6) return '6am';
  if (hour24 === 12) return '12pm';
  if (hour24 === 18) return '6pm';
  return `${hour24 % 12 === 0 ? 12 : hour24 % 12}`;
}

function splitMinutesForDisplay(totalMinutes) {
  return {
    period: totalMinutes < 720 ? '오전' : '오후',
    hour: Math.floor(totalMinutes / 60),
    minute: totalMinutes % 60,
  };
}

function formatDurationLabel(startMinutes, endMinutes) {
  let diff = endMinutes - startMinutes;
  if (diff < 0) diff += MINUTES_PER_DAY;
  return `${Math.floor(diff / 60)}시간 ${String(diff % 60).padStart(2, '0')}분`;
}

// ─── 시간 조정 바텀시트 ─────────────────────────────────────────

const TimeAdjustSheet = styled.div`
  width: 100%;
  max-width: 24.375rem;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 2rem 2rem 0 0;
  box-sizing: border-box;
  padding: 0.75rem 1.25rem 2.125rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 101;
`;

const TimeAdjustDragHandle = styled(Handle)`
  margin: 0 0 1.5rem;
`;

const DurationLabel = styled.span`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.colors.gray800};
`;

const DurationValue = styled.span`
  ${({ theme }) => theme.typography.h2};
  color: ${({ theme }) => theme.colors.gray900};
  margin-top: 0.25rem;
`;

const DialWrapper = styled.div`
  position: relative;
  width: ${DIAL_SIZE / 16}rem;
  height: ${DIAL_SIZE / 16}rem;
  touch-action: none;
`;

const DialTrack = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 50%;
  background: var(--grayscale-gray-200, #EFEFEF);
  -webkit-mask: radial-gradient(
    circle,
    transparent ${RING_RADIUS - RING_WIDTH / 2}px,
    #000 ${RING_RADIUS - RING_WIDTH / 2}px,
    #000 ${RING_RADIUS + RING_WIDTH / 2}px,
    transparent ${RING_RADIUS + RING_WIDTH / 2}px
  );
  mask: radial-gradient(
    circle,
    transparent ${RING_RADIUS - RING_WIDTH / 2}px,
    #000 ${RING_RADIUS - RING_WIDTH / 2}px,
    #000 ${RING_RADIUS + RING_WIDTH / 2}px,
    transparent ${RING_RADIUS + RING_WIDTH / 2}px
  );
`;

const HourLabel = styled.text`
  font-family: 'Pretendard Variable';
  font-size: 14px;
  fill: ${({ $emphasis, theme }) => ($emphasis ? theme.colors.gray900 : '#CCCCCC')};
  text-anchor: middle;
  dominant-baseline: middle;
`;

const DialHandle = styled.circle`
  fill: ${({ theme }) => theme.colors.white};
  stroke: rgba(0, 0, 0, 0.08);
  stroke-width: 1;
  cursor: grab;
`;

const TimeSummaryRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 3.25rem;
  margin-bottom: 4rem;
`;

const TimeSummaryCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const TimeSummaryValue = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
`;

const PeriodText = styled.span`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.colors.gray800};
`;

const TimeValueText = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.primary100};
`;

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const DAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function buildCalendarDays(year, month) {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = new Date(year, month - 1, 0).getDate();
  const cells = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, type: 'prev' });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, type: 'current' });
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) cells.push({ day: i, type: 'next' });
  return cells;
}

function toMs(d) {
  if (!d) return null;
  return new Date(d.year, d.month - 1, d.day).getTime();
}

function resolveDate(day, type, year, month) {
  let y = year, m = month;
  if (type === 'prev') { m--; if (m < 1) { m = 12; y--; } }
  if (type === 'next') { m++; if (m > 12) { m = 1; y++; } }
  return { year: y, month: m, day };
}

function formatDateForApi(d) {
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
}

function toAttendee(member) {
  return { id: member.userId, name: member.nickname, profileImage: member.profileImageUrl };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// 서버가 내려주는 startTime/endTime은 타임존 표시가 없는 로컬시간 문자열이라,
// toISOString()으로 UTC 변환해서 보내면 서버가 이걸 다시 로컬시간처럼 파싱해 날짜가 하루 밀린다.
// 그래서 저장할 때도 항상 이 포맷(타임존 없는 로컬시간 문자열)을 그대로 맞춰서 보낸다.
function toLocalDateTimeString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function toOptionViewModel(rec, index) {
  const start = new Date(rec.startTime);
  const end = new Date(rec.endTime);
  return {
    id: index,
    date: start.getDate(),
    dayOfWeek: DAY_NAMES[start.getDay()],
    timeRange: `${pad(start.getHours())}:${pad(start.getMinutes())}~${pad(end.getHours())}:${pad(end.getMinutes())}`,
    memberCount: rec.availableMemberCount,
    totalCount: rec.totalMemberCount,
    availableAttendees: rec.availableMembers.map(toAttendee),
    unavailableAttendees: rec.unavailableMembers.map(toAttendee),
    startTimeRaw: rec.startTime,
    endTimeRaw: rec.endTime,
    // 시간 조정 다이얼의 드래그 가능 범위 계산용 — 사용자가 저장해도 절대 덮어쓰지 않음
    originalStartTimeRaw: rec.startTime,
    originalEndTimeRaw: rec.endTime,
  };
}

// ─── 페이지 컴포넌트 ────────────────────────────────────────────

export default function TimeRecommendPage() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const today = new Date();
  const todayMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  const {
    roomId,
    promiseId,
    title,
    comment,
    categoryId,
    location,
    proposeStartDate: initialStart,
    proposeEndDate: initialEnd,
    minDuration,
    notificationLeadMinutes,
    selectedMemberIds,
  } = routerLocation.state ?? {};

const isUpdateMode = Boolean(promiseId);

  const [selectedId, setSelectedId] = useState(null);
  const [attendeePopupOption, setAttendeePopupOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [timeAdjustOption, setTimeAdjustOption] = useState(null);
  const [draftStart, setDraftStart] = useState(0);
  const [draftEnd, setDraftEnd] = useState(0);
  const [boundStart, setBoundStart] = useState(0);
  const [boundEnd, setBoundEnd] = useState(MINUTES_PER_DAY);
  const [draggingHandle, setDraggingHandle] = useState(null);
  const dialRef = useRef(null);
  const minGapMinutes = minDuration || DEFAULT_MIN_GAP_MINUTES;
  const fetchRequestIdRef = useRef(0);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState('recommended');

  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: initialStart, end: initialEnd });
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [phase, setPhase] = useState('start');

  async function fetchRecommendations(range, sortValueOverride = sortValue) {
    const requestId = ++fetchRequestIdRef.current;
    setIsLoading(true);
    try {
      const payload = {
        proposeStartDate: formatDateForApi(range.start),
        proposeEndDate: formatDateForApi(range.end),
        searchStartTime: '00:00',
        searchEndTime: '23:30',
        minDuration,
        sortType: SORT_VALUE_TO_API_TYPE[sortValueOverride] ?? 'RECOMMENDED',
      };
      const res = isUpdateMode
        ? await apiClient.post(`/promises/${promiseId}/time-recommendations`, payload)
        : await apiClient.post(`/rooms/${roomId}/promise-time-recommendations`, { ...payload, selectedMemberIds });

      // 늦게 도착한 옛날 요청의 응답이 최신 결과를 덮어쓰지 않게 방지
      if (requestId !== fetchRequestIdRef.current) return;
      setOptions(res.data.map(toOptionViewModel));
      setSelectedId(null);
      closeTimeAdjust();
    } finally {
      if (requestId === fetchRequestIdRef.current) setIsLoading(false);
    }
  }

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchRecommendations(dateRange);
    }
  }, []);

  function handleSortSelect(value) {
    setSortValue(value);
    setIsSortOpen(false);
    fetchRecommendations(dateRange, value);
  }

  const handleConfirm = async () => {
    const selectedOption = options.find((o) => o.id === selectedId);
    if (!selectedOption) return;

    setIsLoading(true);
    try {
      if (isUpdateMode) {
        await apiClient.patch(`/promises/${promiseId}/time/from-recommendation`, {
          proposeStartDate: formatDateForApi(dateRange.start),
          proposeEndDate: formatDateForApi(dateRange.end),
          searchStartTime: '00:00',
          searchEndTime: '23:30',
          recommendedStartTime: selectedOption.originalStartTimeRaw,
          recommendedEndTime: selectedOption.originalEndTimeRaw,
          selectedStartTime: selectedOption.startTimeRaw,
          selectedEndTime: selectedOption.endTimeRaw,
          minDuration,
          sortType: SORT_VALUE_TO_API_TYPE[sortValue] ?? 'RECOMMENDED',
        });
        navigate(-1);
      } else {
        await apiClient.post(`/rooms/${roomId}/promises/from-recommendation`, {
          title,
          comment,
          categoryId,
          proposeStartDate: formatDateForApi(dateRange.start),
          proposeEndDate: formatDateForApi(dateRange.end),
          searchStartTime: '00:00',
          searchEndTime: '23:30',
          recommendedStartTime: selectedOption.originalStartTimeRaw,
          recommendedEndTime: selectedOption.originalEndTimeRaw,
          selectedStartTime: selectedOption.startTimeRaw,
          selectedEndTime: selectedOption.endTimeRaw,
          location,
          minDuration,
          notificationLeadMinutes,
          sortType: SORT_VALUE_TO_API_TYPE[sortValue] ?? 'RECOMMENDED',
          selectedMemberIds,
        });
        navigate(`/room/${roomId}`, { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  function openTimeAdjust(option) {
    const start = new Date(option.startTimeRaw);
    const end = new Date(option.endTimeRaw);
    setDraftStart(start.getHours() * 60 + start.getMinutes());
    setDraftEnd(end.getHours() * 60 + end.getMinutes());

    // 드래그 가능 범위는 항상 서버가 처음 추천해준 시간(originalStartTimeRaw/EndTimeRaw) 기준으로 계산한다.
    // 이전에 저장한 값(startTimeRaw/endTimeRaw) 기준으로 계산하면, 저장할 때마다 그 값을 기준으로
    // 다시 패딩이 잡혀서 열 때마다 범위가 점점 좁아지는(래칫) 버그가 있었다.
    const originalStart = new Date(option.originalStartTimeRaw);
    const originalEnd = new Date(option.originalEndTimeRaw);
    const originalStartMinutes = originalStart.getHours() * 60 + originalStart.getMinutes();
    const originalEndMinutes = originalEnd.getHours() * 60 + originalEnd.getMinutes();

    setBoundStart(Math.max(0, originalStartMinutes - BOUND_PADDING_MINUTES));
    setBoundEnd(Math.min(MINUTES_PER_DAY - TIME_STEP_MINUTES, originalEndMinutes + BOUND_PADDING_MINUTES));
    setTimeAdjustOption(option);
  }

  function closeTimeAdjust() {
    setTimeAdjustOption(null);
    setDraggingHandle(null);
  }

  function angleFromPointerEvent(e) {
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const point = e.touches ? e.touches[0] : e;
    const dx = point.clientX - cx;
    const dy = point.clientY - cy;
    let deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return deg;
  }

  useEffect(() => {
    if (!draggingHandle) return undefined;

    function handleMove(e) {
      e.preventDefault();
      const minutes = snapMinutes(angleToMinutes(angleFromPointerEvent(e)));

      if (draggingHandle === 'start') {
        const upper = Math.max(boundStart, draftEnd - minGapMinutes);
        setDraftStart(Math.min(Math.max(minutes, boundStart), upper));
      } else {
        const lower = Math.min(boundEnd, draftStart + minGapMinutes);
        setDraftEnd(Math.max(Math.min(minutes, boundEnd), lower));
      }
    }

    function handleUp() {
      setDraggingHandle(null);
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [draggingHandle, draftStart, draftEnd, boundStart, boundEnd, minGapMinutes]);

  function handleTimeAdjustSave() {
    const optionId = timeAdjustOption.id;

    setOptions((prev) => prev.map((o) => {
      if (o.id !== optionId) return o;

      const start = new Date(o.startTimeRaw);
      start.setHours(Math.floor(draftStart / 60), draftStart % 60, 0, 0);
      const end = new Date(o.endTimeRaw);
      end.setHours(Math.floor(draftEnd / 60), draftEnd % 60, 0, 0);

      return {
        ...o,
        startTimeRaw: toLocalDateTimeString(start),
        endTimeRaw: toLocalDateTimeString(end),
        timeRange: `${pad(start.getHours())}:${pad(start.getMinutes())}~${pad(end.getHours())}:${pad(end.getMinutes())}`,
      };
    }));

    closeTimeAdjust();
  }

  const handleDecisionHelper = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/api/v1/rooms/${roomId}/decision-helper`, {
        title,
        comment,
        categoryId,
        proposeStartDate: formatDateForApi(dateRange.start),
        proposeEndDate: formatDateForApi(dateRange.end),
        searchStartTime: '00:00',
        searchEndTime: '23:30',
        minDuration,
        sortType: 'RECOMMENDED',
        location,
        notificationLeadMinutes,
        selectedMemberIds,
      });
      navigate(`/room/${roomId}/chat`, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };
  const prevMonth = () => {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  };

  const handleDateSelect = (day, type) => {
    const clicked = resolveDate(day, type, viewYear, viewMonth);
    if (phase === 'start') {
      setStartDate(clicked); setEndDate(null); setPhase('end');
    } else {
      if (toMs(clicked) < toMs(startDate)) {
        setStartDate(clicked); setEndDate(null); setPhase('end');
      } else {
        setEndDate(clicked); setPhase('start'); setHoverDate(null);
      }
    }
  };

  const getCellState = (day, type) => {
    if (type !== 'current') return 'disabled';
    const cellMs = new Date(viewYear, viewMonth - 1, day).getTime();
    if (cellMs < todayMs) return 'disabled';
    const startMs = toMs(startDate);
    const endMs = toMs(endDate);
    const effectiveEndMs = endMs ?? toMs(hoverDate);
    if (startMs === null) return 'default';
    if (effectiveEndMs === null) return cellMs === startMs ? 'start' : 'default';
    const lo = Math.min(startMs, effectiveEndMs);
    const hi = Math.max(startMs, effectiveEndMs);
    if (lo === hi && cellMs === lo) return 'start';
    if (cellMs === lo) return startMs <= effectiveEndMs ? 'start' : 'end';
    if (cellMs === hi) return startMs <= effectiveEndMs ? 'end' : 'start';
    if (cellMs > lo && cellMs < hi) return 'in-range';
    return 'default';
  };

  const handleDateReset = () => {
    setStartDate(null); setEndDate(null); setPhase('start'); setHoverDate(null);
  };

  const handleDateConfirm = () => {
    const newRange = { start: startDate, end: endDate };
    setDateRange(newRange);
    setIsDateSheetOpen(false);
    fetchRecommendations(newRange);
  };

  const cells = buildCalendarDays(viewYear, viewMonth);

  return (
    <PageWrapper noNav>
      <Header title={title ?? '약속 만들기'} leftIcon="back" onLeft={() => navigate(-1)} />

      <FilterBar>
        <ChipScheduleOption
          text={dateRange.start ? `${dateRange.start.month}.${dateRange.start.day}~${dateRange.end?.month}.${dateRange.end?.day}` : ''}
          onClick={() => setIsDateSheetOpen(true)}
        />
        <SortButton
          text={SORT_OPTIONS.find(o => o.value === sortValue)?.label ?? '추천순'}
          onClick={() => setIsSortOpen(true)}
        />
      </FilterBar>

      <CardList>
        {!isLoading && options.length === 0 ? (
          <EmptyState>
            <EmptyTitle>가능한 시간이 없어요</EmptyTitle>
            <EmptySubtext>일정을 늘려보시는 것은 어떨까요?</EmptySubtext>
          </EmptyState>
        ) : (
          options.map((option) => (
            <TimeOptionCard
              key={option.id}
              date={option.date}
              dayOfWeek={option.dayOfWeek}
              timeRange={option.timeRange}
              memberCount={option.memberCount}
              totalCount={option.totalCount}
              selected={selectedId === option.id}
              onClick={() => {
                setSelectedId(option.id);
                openTimeAdjust(option);
              }}
              onAttendeeClick={() => setAttendeePopupOption(option)}
            />
          ))
        )}
      </CardList>

      <BottomArea>
        {isUpdateMode ? (
          <Btn text="선택 완료" disabled={selectedId === null} onClick={handleConfirm} navigate={navigate} />
        ) : (
          <>
            <MagicWandBtn onClick={handleDecisionHelper} disabled={isLoading} aria-label="결정이에게 맡기기">
              <MagicWandIcon />
            </MagicWandBtn>
            <SelectBtnWrapper>
              <Btn text="선택 완료" disabled={selectedId === null} onClick={handleConfirm} navigate={navigate} />
            </SelectBtnWrapper>
          </>
        )}
      </BottomArea>

      <LoadingOverlay isLoading={isLoading} />

      {attendeePopupOption && (
        <AttendeePopup
          availableAttendees={attendeePopupOption.availableAttendees}
          unavailableAttendees={attendeePopupOption.unavailableAttendees}
          onClose={() => setAttendeePopupOption(null)}
        />
      )}

      {timeAdjustOption && (
        <>
          <Dim onClick={closeTimeAdjust} />
          <TimeAdjustSheet
            style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <TimeAdjustDragHandle />

            <DurationLabel>총 약속 시간</DurationLabel>
            <DurationValue>{formatDurationLabel(draftStart, draftEnd)}</DurationValue>

            <DialWrapper ref={dialRef}>
              <DialTrack />
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}
                style={{ touchAction: 'none', position: 'relative', zIndex: 1, display: 'block' }}
              >
                <circle
                  cx={DIAL_CENTER}
                  cy={DIAL_CENTER}
                  r={RING_RADIUS}
                  stroke="#EFEFEF"
                  strokeWidth={RING_WIDTH}
                  fill="none"
                />
                <path
                  d={describeArc(
                    RING_RADIUS,
                    minutesToAngle(Math.min(boundStart, boundEnd)),
                    minutesToAngle(Math.max(boundStart, boundEnd))
                  )}
                  stroke="#DCDCDC"
                  strokeWidth={RING_WIDTH}
                  fill="none"
                />
                <path
                  d={describeArc(RING_RADIUS, minutesToAngle(draftStart), minutesToAngle(draftEnd))}
                  stroke="#81D0C1"
                  strokeWidth={RING_WIDTH}
                  strokeLinecap="round"
                  fill="none"
                />

                {Array.from({ length: 24 }, (_, hour) => {
                  const angle = hour * 15;
                  const outer = polarPoint(TICK_OUTER_RADIUS, angle);
                  const inner = polarPoint(TICK_INNER_RADIUS, angle);
                  const isQuarter = hour % 6 === 0;
                  return (
                    <line
                      key={`tick-${hour}`}
                      x1={inner.x}
                      y1={inner.y}
                      x2={outer.x}
                      y2={outer.y}
                      stroke={isQuarter ? '#999999' : '#CCCCCC'}
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  );
                })}

                {Array.from({ length: 12 }, (_, i) => {
                  const hour = i * 2;
                  // 6am/6pm은 원의 정확히 좌우(가로) 위치라 텍스트 폭이 그대로 링 쪽 간격을 잠식해서, 그때만 조금 더 안쪽으로 밀어줌
                  const isHorizontal = hour === 6 || hour === 18;
                  const pos = polarPoint(isHorizontal ? LABEL_RADIUS - 8 : LABEL_RADIUS, hour * 15);
                  const isQuarter = hour === 0 || hour === 6 || hour === 12 || hour === 18;
                  return (
                    <HourLabel key={`label-${hour}`} x={pos.x} y={pos.y} $emphasis={isQuarter}>
                      {formatHourTickLabel(hour)}
                    </HourLabel>
                  );
                })}

                <g
                  onMouseDown={() => setDraggingHandle('start')}
                  onTouchStart={() => setDraggingHandle('start')}
                  style={{ cursor: 'grab' }}
                >
                  <circle
                    cx={polarPoint(RING_RADIUS, minutesToAngle(draftStart)).x}
                    cy={polarPoint(RING_RADIUS, minutesToAngle(draftStart)).y}
                    r={HANDLE_TOUCH_R}
                    fill="transparent"
                  />
                  <DialHandle
                    cx={polarPoint(RING_RADIUS, minutesToAngle(draftStart)).x}
                    cy={polarPoint(RING_RADIUS, minutesToAngle(draftStart)).y}
                    r={HANDLE_R}
                  />
                </g>
                <g
                  onMouseDown={() => setDraggingHandle('end')}
                  onTouchStart={() => setDraggingHandle('end')}
                  style={{ cursor: 'grab' }}
                >
                  <circle
                    cx={polarPoint(RING_RADIUS, minutesToAngle(draftEnd)).x}
                    cy={polarPoint(RING_RADIUS, minutesToAngle(draftEnd)).y}
                    r={HANDLE_TOUCH_R}
                    fill="transparent"
                  />
                  <DialHandle
                    cx={polarPoint(RING_RADIUS, minutesToAngle(draftEnd)).x}
                    cy={polarPoint(RING_RADIUS, minutesToAngle(draftEnd)).y}
                    r={HANDLE_R}
                  />
                </g>
              </svg>
            </DialWrapper>

            <TimeSummaryRow>
              <TimeSummaryCol>
                <DurationLabel>시작 시간</DurationLabel>
                <TimeSummaryValue>
                  <PeriodText>{splitMinutesForDisplay(draftStart).period}</PeriodText>
                  <TimeValueText>
                    {pad(splitMinutesForDisplay(draftStart).hour)}:{pad(splitMinutesForDisplay(draftStart).minute)}
                  </TimeValueText>
                </TimeSummaryValue>
              </TimeSummaryCol>
              <TimeSummaryCol>
                <DurationLabel>종료 시간</DurationLabel>
                <TimeSummaryValue>
                  <PeriodText>{splitMinutesForDisplay(draftEnd).period}</PeriodText>
                  <TimeValueText>
                    {pad(splitMinutesForDisplay(draftEnd).hour)}:{pad(splitMinutesForDisplay(draftEnd).minute)}
                  </TimeValueText>
                </TimeSummaryValue>
              </TimeSummaryCol>
            </TimeSummaryRow>

            <Btn text="저장" onClick={handleTimeAdjustSave} />
          </TimeAdjustSheet>
        </>
      )}

      {isDateSheetOpen && (
        <>
          <Dim onClick={() => setIsDateSheetOpen(false)} />
          <DateSheet>
            <DateHandle />
            <CalendarArea>
              <MonthHeader>
                <NavBtn onClick={prevMonth}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 7L9 12L15 17" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </NavBtn>
                <MonthLabel>{viewYear}년 {viewMonth}월</MonthLabel>
                <NavBtn onClick={nextMonth}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 17L15 12L9 7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </NavBtn>
              </MonthHeader>
              <DayHeaderRow>
                {DAYS.map(d => <DayLabel key={d}>{d}</DayLabel>)}
              </DayHeaderRow>
              <CalendarGrid onMouseLeave={() => setHoverDate(null)}>
                {cells.map((cell, i) => (
                  <DateCell
                    key={i}
                    date={cell.day}
                    state={getCellState(cell.day, cell.type)}
                    isToday={
                      cell.type === 'current' &&
                      today.getFullYear() === viewYear &&
                      today.getMonth() + 1 === viewMonth &&
                      today.getDate() === cell.day
                    }
                    onClick={() => handleDateSelect(cell.day, cell.type)}
                    onMouseEnter={() => {
                      if (phase === 'end' && startDate)
                        setHoverDate(resolveDate(cell.day, cell.type, viewYear, viewMonth));
                    }}
                  />
                ))}
              </CalendarGrid>
            </CalendarArea>
            <DateButtonRow>
              <ResetBtn onClick={handleDateReset}>초기화</ResetBtn>
              <ConfirmBtn onClick={handleDateConfirm}>선택 완료</ConfirmBtn>
            </DateButtonRow>
          </DateSheet>
        </>
      )}

      {isSortOpen && (
        <>
          <Dim onClick={() => setIsSortOpen(false)} />
          <SortSheet>
            <SortHandle />
            <SortTitle>정렬</SortTitle>
            <SortOptionList>
              {SORT_OPTIONS.map((option, idx) => (
                <div key={option.value}>
                  {idx > 0 && <SortDivider />}
                  <OptionItem
                    text={option.label}
                    selected={sortValue === option.value}
                    onClick={() => handleSortSelect(option.value)}
                  />
                </div>
              ))}
            </SortOptionList>
          </SortSheet>
        </>
      )}
    </PageWrapper>
  );
}