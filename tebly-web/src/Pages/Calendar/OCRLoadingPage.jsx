import { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import ocrIcon from '../../assets/icons/OCR_icon.svg';
import apiClient from '../../api/client';
import { useOCRScheduleStore } from '../../store/OCRScheduleStore';
import { useScheduleStore } from '../../store/ScheduleStore';

const DAY_INDEX = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };

function nearestDateForDay(dayOfWeek) {
  const targetDay = DAY_INDEX[dayOfWeek];
  const base = new Date();
  if (targetDay === undefined) return { year: base.getFullYear(), month: base.getMonth() + 1, day: base.getDate() };
  const diff = (targetDay - base.getDay() + 7) % 7;
  base.setDate(base.getDate() + diff);
  return { year: base.getFullYear(), month: base.getMonth() + 1, day: base.getDate() };
}

const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

function mapOcrItem(item, index, defaultCategory) {
  const dateObj = nearestDateForDay(item.dayOfWeek);
  const d = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
  return {
    id: `ocr-${Date.now()}-${index}`,
    title: item.title,
    memo: '',
    category: defaultCategory ?? null,
    allDay: false,
    startDate: dateObj,
    endDate: dateObj,
    startTime: item.startTime,
    endTime: item.endTime,
    place: '',
    alarmTime: '',
    repeat: '없음',
    time: `${DAY_KO[d.getDay()]}요일 ${item.startTime}~${item.endTime}`,
  };
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.white};
  padding-top: 106px;
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.h1};
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0;
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 240px;
  height: 240px;
  margin-top: 56px;
`;

const Icon = styled.img`
  width: 100%;
  height: 100%;
  display: block;
`;

const Description = styled.p`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray500};
  margin: 56px 0 0 0;
  text-align: center;
`;

function OCRLoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSchedules = useOCRScheduleStore((state) => state.setSchedules);
  const fetchCategories = useScheduleStore((state) => state.fetchCategories);

  useEffect(() => {
    const imageFile = location.state?.imageFile;
    if (!imageFile) {
      navigate(-1);
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    Promise.all([apiClient.post('/schedules/ocr', formData), fetchCategories()])
      .then(([res]) => {
        const defaultCategory =
          useScheduleStore.getState().categories.find((c) => c.categoryIcon === 'Class') ?? null;
        setSchedules(res.data.schedules.map((item, index) => mapOcrItem(item, index, defaultCategory)));
        navigate('/ocr-result', { replace: true });
      })
      .catch(() => {
        alert('일정을 인식하지 못했어요. 다시 시도해주세요.');
        navigate(-1);
      });
  }, [location.state, navigate, setSchedules, fetchCategories]);

  return (
    <Container>
      <Title>
        사진 속 일정을
        <br />
        불러오는 중이에요
      </Title>

      <IconWrapper>
        <Icon src={ocrIcon} alt="OCR 아이콘" />
      </IconWrapper>

      <Description>
        날짜, 시간, 장소를 확인하고
        <br />
        일정으로 정리하고 있어요.
      </Description>
    </Container>
  );
}

export default OCRLoadingPage;