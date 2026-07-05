import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/common/Header';
import Textfield from '../../components/common/Textfield';
import SelectRow from '../../components/room/SelectRow';
import Btn from '../../components/common/Btn';

import DatePopup from '../../components/room/DatePopup';
import CategoryPopup from '../../components/room/CategoryPopup';
import AlarmPopup from '../../components/room/AlarmPopup';
import MinTimePickerPopup from '../../components/room/MinTimePickerPopup';

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

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
`;

/* 
const BtnWrapper = styled.div`
  width: 350px;
  margin: 186px auto 0;
`; */


export default function CreateAppointmentPage() {
  const [appointmentName, setAppointmentName] = useState('');
  const [memo, setMemo] = useState('');
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const roomId = routerLocation.state?.roomId;
  const selectedMembers = routerLocation.state?.selectedMembers ?? [];

  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const [date, setDate] = useState('');
  const [minTime, setMinTime] = useState('');

  const [editingField, setEditingField] = useState(null);
  const [popupType, setPopupType] = useState(null);

  return (
    <>
      <HeaderWrapper>
        <Header title="약속 만들기" leftIcon="back" onLeft={() => navigate(-1)} />
      </HeaderWrapper>
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
              text_selected={category}
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
              onClick={() => navigate('/select-friend', { state: { appointmentMode: true, roomId } })}
            />

          </SelectRowContainer>
        </ContentArea>
      </ScrollContent>

      <BtnWrapper>
        <Btn
          text="다음"
          onClick={() => navigate('/time-recommend')}
        />
      </BtnWrapper>

      {popupType === 'minTime' && (
        <MinTimePickerPopup
          onClose={() => setPopupType(null)}
          onConfirm={({ hour, minute }) => {
            const h = parseInt(hour);
            const m = parseInt(minute);
            const label = `${h}시간${m > 0 ? ` ${m}분` : ''}`;
            setMinTime(label);
            setPopupType(null);
          }}
        />
      )}

      {popupType === 'category' && (
        <CategoryPopup
          selectedCategory={category}
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
          onClose={() => setPopupType(null)}
          onReset={() => {
            setDate('');
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

            setPopupType(null);
          }}
        />
      )}
    </>
  );
}