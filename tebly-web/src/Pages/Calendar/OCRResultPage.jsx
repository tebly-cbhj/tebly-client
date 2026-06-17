import { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/common/Header'; 
import ScheduleCard from '../../components/calendar/addSchedule/ScheduleCard'; 
import Btn from '../../components/common/Btn'; 
import CheckIcon from '../../assets/icons/check.svg?react'; 
import { PageWrapper } from '../../PageWrapper';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_ICON_MAP } from '../../components/room/CategoryIcons';

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
  // TODO: 페이지 진입 시(useEffect) 이전 페이지에서 넘겨받은 이미지 데이터를 
  // 백엔드 OCR API로 전송하고, 반환된 데이터를 setSchedules로 업데이트하는 로직 추가 필요.
  // 로딩 상태 관리 필요: isLoading 사용
  const [schedules, setSchedules] = useState([
    { id: 1, title: '시스템 프로그래밍 보강', time: '14:00~16:00', category: 'Class' },
    { id: 2, title: 'tave 회의', time: '15:00~17:00', category: 'TeamProject' },
    { id: 3, title: '치과 정기검진', time: '17:00~19:00', category: 'Other' },
  ]);

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === schedules.length) {
      setSelectedIds([]); 
    } else {
      setSelectedIds(schedules.map((schedule) => schedule.id)); 
    }
  };

  const handleAddCalendar = () => {
    console.log('선택된 일정 IDs:', selectedIds);
    // TODO 1: schedules 배열에서 selectedIds에 포함된 일정 객체들만 필터링하기 (finalSchedules)
    // TODO 2: 필터링된 일정들을 백엔드 '일정 등록 API'로 전송하여 DB에 저장
    // TODO 3: API 호출 성공 시, usePersonalScheduleStore의 addSchedule을 호출하여 전역 상태 업데이트
    // TODO 4: 모든 작업 완료 후 홈('/') 또는 캘린더 화면으로 navigate 이동
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
          const CategoryIcon = iconData.SelectedIcon; // SelectedIcon만 추출

          return (
            <ScheduleCard
              key={schedule.id}
              title={schedule.title}
              time={schedule.time}
              categoryIcon={<CategoryIcon />} 
              isSelected={selectedIds.includes(schedule.id)}
              onClick={() => toggleSelect(schedule.id)}
            />
          );
        })}
      </CardListContainer>

      <BottomBtnWrapper>
        <Btn 
          text="캘린더에 추가하기" 
          onClick={() => navigate('/')}
          disabled={selectedIds.length === 0} 
        /> {/* TODO: PersonalScheduleStore의 일정 추가 함수 이용해 일정 추가 */}
      </BottomBtnWrapper>
    </PageWrapper>
  );
}