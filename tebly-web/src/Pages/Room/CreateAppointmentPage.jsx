import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import Textfield from '../../components/common/Textfield';
import SelectRow from '../../components/room/SelectRow';
import Btn from '../../components/common/Btn';

import DatePopup from '../../components/room/DatePopup';
import CategoryPopup from '../../components/room/CategoryPopup';
import AlarmPopup from '../../components/room/AlarmPopup';
import MinTimePickerPopup from '../../components/room/MinTimePickerPopup';

import { ALARM_TO_MINUTES } from '../../store/PersonalScheduleStore';

import PlaceIcon from '../../assets/icons/place.svg?react';
import CategoryIcon from '../../assets/icons/category.svg?react';
import BellIcon from '../../assets/icons/bell-line.svg?react';
import DateIcon from '../../assets/icons/calendar-fill.svg?react';
import FriendsIcon from '../../assets/icons/friends.svg?react';
import ClockIcon from '../../assets/icons/clock.svg?react';

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;
const ScrollContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 90px;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const InputContainer = styled.div`
  display: flex;
  width: 390px;
  max-width: 100%;
  padding: 8px 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  box-sizing: border-box;
`;

const Label = styled.span`
  height: 25px;
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
`;

const SelectRowContainer = styled.div`
  display: flex;
  width: 390px;
  max-width: 100%;
  padding: 0 20px;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
`;

const BtnWrapper = styled.div`
  position: fixed;
  left: 50%;
  bottom: 21px;
  transform: translateX(-50%);
  width: 350px;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.25rem;
  background: rgba(26, 26, 26, 0.85);
  border-radius: 0.75rem;
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.white};
  white-space: nowrap;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 200;
`;

function getNotificationLeadMinutes(alarmTime) {
  if (!alarmTime) return [];
  return alarmTime
    .split(',')
    .map((label) => ALARM_TO_MINUTES[label.trim()])
    .filter((n) => n !== undefined);
}

export default function CreateAppointmentPage() {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const roomId = routerLocation.state?.roomId;
  const selectedMembers = routerLocation.state?.selectedMembers ?? [];

  const [appointmentName, setAppointmentName] = useState(routerLocation.state?.appointmentName ?? '');
  const [memo, setMemo] = useState(routerLocation.state?.memo ?? '');
  const [location, setLocation] = useState(routerLocation.state?.location ?? '');
  const [category, setCategory] = useState(routerLocation.state?.category ?? null); // { categoryId, categoryName, categoryIcon, isPrivate }
  const [alarmTime, setAlarmTime] = useState(routerLocation.state?.alarmTime ?? '');
  const [date, setDate] = useState(routerLocation.state?.date ?? '');
  const [dateRange, setDateRange] = useState(routerLocation.state?.dateRange ?? null);
  const [minTime, setMinTime] = useState(routerLocation.state?.minTime ?? '');
  const [minDurationMinutes, setMinDurationMinutes] = useState(routerLocation.state?.minDurationMinutes ?? 0);

  const [editingField, setEditingField] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000);
  }

  function handleNext() {
    if (!appointmentName.trim()) {
      showToast('약속 이름을 입력해주세요.');
      return;
    }
    if (!dateRange?.start) {
      showToast('약속 기간을 선택해주세요.');
      return;
    }
    if (!minDurationMinutes) {
      showToast('최소 시간을 선택해주세요.');
      return;
    }
    if (!category) {
      showToast('카테고리를 선택해주세요.');
      return;
    }
    if (selectedMembers.length === 0) {
      showToast('친구를 선택해주세요.');
      return;
    }

    navigate('/time-recommend', {
      state: {
        roomId,
        title: appointmentName,
        comment: memo,
        categoryId: category?.categoryId,
        location,
        proposeStartDate: dateRange?.start,
        proposeEndDate: dateRange?.end ?? dateRange?.start,
        minDuration: minDurationMinutes,
        notificationLeadMinutes: getNotificationLeadMinutes(alarmTime),
        selectedMemberIds: selectedMembers.map((m) => m.id),
      },
    });
  }

  return (
    <PageWrapper noNav>
      <Header title="약속 만들기" leftIcon="back" onLeft={() => navigate(`/room/${roomId}`)} />
      <ScrollContent>
        <ContentArea>
          <InputContainer>
            <Label>약속 이름</Label>
            <Textfield
              value={appointmentName}
              onChange={(e) => setAppointmentName(e.target.value)}
              placeholder="약속 이름을 입력해 주세요"
            />
          </InputContainer>

          <InputContainer>
            <Label>메모</Label>
            <Textfield
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="참고할 내용을 적어주세요"
            />
          </InputContainer>

          <SelectRowContainer>
            <SelectRow
              LeftIcon={PlaceIcon}
              text_empty="약속 장소"
              text_selected={location}
              state={
                editingField === 'location'
                  ? 'typing'
                  : location
                    ? 'selected'
                    : 'empty'
              }
              value={location}
              onClick={() => setEditingField('location')}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setEditingField(null);
              }}
            />

            <SelectRow
              LeftIcon={DateIcon}
              text_empty="약속 기간 설정"
              text_selected={date}
              state={date ? 'selected' : 'empty'}
              onClick={() => setPopupType('date')}
            />

            <SelectRow
              LeftIcon={ClockIcon}
              text_empty="최소 시간 설정"
              text_selected={minTime}
              state={minTime ? 'selected' : 'empty'}
              onClick={() => setPopupType('minTime')}
            />

            <SelectRow
              LeftIcon={CategoryIcon}
              text_empty="카테고리"
              text_selected={category?.categoryName}
              state={category ? 'selected' : 'empty'}
              onClick={() => setPopupType('category')}
            />

            <SelectRow
              LeftIcon={BellIcon}
              text_empty="알림 설정"
              text_selected={alarmTime}
              state={alarmTime ? 'selected' : 'empty'}
              onClick={() => setPopupType('alarm')}
            />

            <SelectRow
              LeftIcon={FriendsIcon}
              text_empty="친구 선택"
              text_selected={selectedMembers.length > 0 ? `${selectedMembers.length}명 선택됨` : ''}
              state={selectedMembers.length > 0 ? 'selected' : 'empty'}
              onClick={() => navigate('/select-friend', {
                state: {
                  appointmentMode: true,
                  roomId,
                  appointmentName,
                  memo,
                  location,
                  category,
                  alarmTime,
                  date,
                  dateRange,
                  minTime,
                  minDurationMinutes,
                  selectedMembers,
                },
              })}
            />

          </SelectRowContainer>
        </ContentArea>
      </ScrollContent>

      <BtnWrapper>
        <Btn text="다음" onClick={handleNext} />
      </BtnWrapper>

      <Toast $visible={!!toastMessage}>{toastMessage}</Toast>

      {popupType === 'minTime' && (
        <MinTimePickerPopup
          onClose={() => setPopupType(null)}
          onConfirm={({ hour, minute }) => {
            const h = parseInt(hour);
            const m = parseInt(minute);
            const label = `${h}시간${m > 0 ? ` ${m}분` : ''}`;
            setMinTime(label);
            setMinDurationMinutes(h * 60 + m);
            setPopupType(null);
          }}
        />
      )}

      {popupType === 'category' && (
        <CategoryPopup
          selectedCategoryId={category?.categoryId}
          defaultOnly
          onClose={() => setPopupType(null)}
          onSelect={(value) => {
            setCategory(value);
            setPopupType(null);
          }}
        />
      )}

      {popupType === 'alarm' && (
        <AlarmPopup
          onClose={() => setPopupType(null)}
          onSelect={(value) => {
          setAlarmTime(value.join(', '));
          setPopupType(null);
        }}
        />
      )}

      {popupType === 'date' && (
        <DatePopup
          disablePast
          onClose={() => setPopupType(null)}
          onReset={() => {
            setDate('');
            setDateRange(null);
            setPopupType(null);
          }}
          onConfirm={(value) => {
            const formatDate = (date) => {
              if (!date) return '';

              return `${date.year}/${String(date.month).padStart(2, '0')}/${String(
                date.day
              ).padStart(2, '0')}`;
            };

            const start = formatDate(value.start);
            const end = formatDate(value.end);

            if (start && end && start !== end) {
              setDate(`${start}~${end}`);
            } else {
              setDate(start);
            }

            setDateRange(value);
            setPopupType(null);
          }}
        />
      )}
    </PageWrapper>
  );
}