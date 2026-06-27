import { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/common/Header';
import ScheduleCard from '../../components/calendar/addSchedule/ScheduleCard';
import Btn from '../../components/common/Btn';
import CheckIcon from '../../assets/icons/check.svg?react';
import { PageWrapper } from '../../PageWrapper';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_ICON_MAP } from '../../components/room/CategoryIcons';
import { useOCRScheduleStore } from '../../store/OCRScheduleStore';
import { usePersonalScheduleStore } from '../../store/PersonalScheduleStore';
import OCREditSheet from '../../components/calendar/OCREditSheet';

const ResultHeaderContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0 20px 16px 20px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

const LeftTextContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 3px;
  flex: 1 0 0;
  min-width: 0;
  white-space: nowrap;
  flex-shrink: 0;
`;

const LabelText = styled.span`
  ${({ theme }) => theme.typography.body3}
  color: ${({ theme }) => theme.colors.gray800};

  position: relative;
  top: 2.8px;
`;

const CountText = styled.span`
  ${({ theme }) => theme.typography.s2}
  color: ${({ theme }) => theme.colors.gray900 || '#1A1A1A'};
`;

const SelectAllBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  cursor: pointer;
`;

const SelectAllText = styled.span`
  ${({ theme }) => theme.typography.btn3}
  color: ${({ theme }) => theme.colors.gray900 || '#1A1A1A'};
`;

const CardListContainer = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const BottomBtnWrapper = styled.div`
  padding: 12px 20px 34px 20px;
  width: 100%;
  box-sizing: border-box;
`;

export default function OCRResultPage() {
  const navigate = useNavigate();
  const { schedules } = useOCRScheduleStore();
  const addSchedule = usePersonalScheduleStore((state) => state.addSchedule);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editScheduleId, setEditScheduleId] = useState(null);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === schedules.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(schedules.map((s) => s.id));
    }
  };

  const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'];
  const DAY_MAP = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 };

  function toDateStr(dateObj) {
    const d = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
    return `${dateObj.year}.${String(dateObj.month).padStart(2, '0')}.${String(dateObj.day).padStart(2, '0')} (${DAY_KO[d.getDay()]})`;
  }

  function nearestDateFromTimeStr(timeStr) {
    const dayChar = timeStr?.split(' ')[0]?.charAt(0);
    const targetDay = DAY_MAP[dayChar];
    const base = new Date();
    if (targetDay === undefined) return base;
    const diff = (targetDay - base.getDay() + 7) % 7;
    base.setDate(base.getDate() + diff);
    return base;
  }

  function resolveDateStr(dateObj, timeStr) {
    if (dateObj) return toDateStr(dateObj);
    const d = nearestDateFromTimeStr(timeStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${DAY_KO[d.getDay()]})`;
  }

  const handleAddCalendar = () => {
    const selected = schedules.filter((s) => selectedIds.includes(s.id));
    selected.forEach((s) => {
      const startDateStr = resolveDateStr(s.startDate, s.time);
      const endDateStr = resolveDateStr(s.endDate ?? s.startDate, s.time);
      addSchedule({
        title: s.title,
        memo: s.memo || '',
        startDate: startDateStr,
        endDate: endDateStr,
        time: s.allDay ? '' : `${s.startTime} - ${s.endTime}`,
        location: s.place || '',
        category: s.category,
        alarmTime: s.alarmTime || '',
        repeat: null,
      });
    });
    navigate('/');
  };

  return (
    <PageWrapper>
      <Header
        title="일정 추가"
        leftIcon="back"
        onLeft={() => navigate(-1)}
        icons={[]}
      />

      <ResultHeaderContainer>
        <LeftTextContainer>
          <LabelText>인식된 일정</LabelText>
          <CountText>{schedules.length}개</CountText>
        </LeftTextContainer>

        <SelectAllBtn onClick={handleSelectAll}>
          <CheckIcon
            color={selectedIds.length === schedules.length ? '#B92D2D' : '#1A1A1A'}
          />
          <SelectAllText>전체 선택</SelectAllText>
        </SelectAllBtn>
      </ResultHeaderContainer>

      <CardListContainer>
        {schedules.map((schedule) => {
          const iconData = CATEGORY_ICON_MAP[schedule.category] || CATEGORY_ICON_MAP.Other;
          const CategoryIcon = iconData.SelectedIcon;

          return (
            <ScheduleCard
              key={schedule.id}
              title={schedule.title}
              time={schedule.time}
              categoryIcon={<CategoryIcon />}
              isSelected={selectedIds.includes(schedule.id)}
              onBodyClick={() => setEditScheduleId(schedule.id)}
              onRadioClick={() => toggleSelect(schedule.id)}
            />
          );
        })}
      </CardListContainer>

      <BottomBtnWrapper>
        <Btn
          text="캘린더에 추가하기"
          onClick={handleAddCalendar}
          disabled={selectedIds.length === 0}
        />
      </BottomBtnWrapper>

      {editScheduleId !== null && (
        <OCREditSheet
          scheduleId={editScheduleId}
          onClose={() => setEditScheduleId(null)}
        />
      )}
    </PageWrapper>
  );
}
