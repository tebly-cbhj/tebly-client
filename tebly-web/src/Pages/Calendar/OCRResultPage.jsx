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
import { REPEAT_KO_TO_TYPE } from '../../store/PersonalScheduleStore';
import apiClient from '../../api/client';
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
  max-width: 480px;
  box-sizing: border-box;
`;

export default function OCRResultPage() {
  const navigate = useNavigate();
  const { schedules } = useOCRScheduleStore();
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

  function toIsoDateTime(dateObj, timeStr) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${dateObj.year}-${pad(dateObj.month)}-${pad(dateObj.day)}T${timeStr}:00`;
  }

  const handleAddCalendar = async () => {
    const selected = schedules.filter((s) => selectedIds.includes(s.id));

    if (selected.some((s) => !s.category?.categoryId)) {
      alert('카테고리를 선택하지 않은 일정이 있어요. 먼저 카테고리를 선택해주세요.');
      return;
    }

    const payload = {
      schedules: selected.map((s) => ({
        categoryId: s.category.categoryId,
        title: s.title,
        startTime: toIsoDateTime(s.startDate, s.startTime),
        endTime: toIsoDateTime(s.endDate ?? s.startDate, s.endTime),
        repeatType: REPEAT_KO_TO_TYPE[s.repeat] || 'NONE',
      })),
    };

    try {
      await apiClient.post('/schedules/ocr/confirm', payload);
      navigate('/');
    } catch {
      alert('일정 저장에 실패했어요. 다시 시도해주세요.');
    }
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
          const iconData = CATEGORY_ICON_MAP[schedule.category?.categoryIcon] || CATEGORY_ICON_MAP.Other;
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
