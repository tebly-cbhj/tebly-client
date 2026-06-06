import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import TextField from '../../components/common/TextField';
import SelectRow from '../../components/room/SelectRow';
import Btn from '../../components/common/Btn';

import DatePopup from '../../components/room/DatePopup';
import CategoryPopup from '../../components/room/CategoryPopup';
import AlarmPopup from '../../components/room/AlarmPopup';

import PlaceIcon from '../../assets/icons/place.svg?react';
import CategoryIcon from '../../assets/icons/category.svg?react';
import BellIcon from '../../assets/icons/bell-line.svg?react';
import DateIcon from '../../assets/icons/calendar-fill.svg?react';

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
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

/* 
const BtnWrapper = styled.div`
  width: 350px;
  margin: 186px auto 0;
`; */


export default function CreateAppointmentPage() {
  const [appointmentName, setAppointmentName] = useState('');
  const [memo, setMemo] = useState('');
  const navigate = useNavigate();

  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const [date, setDate] = useState('');

  const [editingField, setEditingField] = useState(null);
  const [popupType, setPopupType] = useState(null);

  return (
    <PageWrapper>
      <Header title="약속 만들기" leftIcon="back" onLeft={() => navigate(-1)} />

      <ContentArea>
        <InputContainer>
          <Label>약속 이름</Label>
          <TextField
            value={appointmentName}
            onChange={(e) => setAppointmentName(e.target.value)}
            placeholder="약속 이름을 입력해 주세요"
          />
        </InputContainer>

        <InputContainer>
          <Label>메모</Label>
          <TextField
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
            LeftIcon={CategoryIcon}
            text_empty="카테고리"
            text_selected={category}
            state={category ? 'selected' : 'empty'}
            onClick={() => setPopupType('category')}
          />

          <SelectRow
            LeftIcon={BellIcon}
            text_empty="알림 받을 시간"
            text_selected={alarmTime}
            state={alarmTime ? 'selected' : 'empty'}
            onClick={() => setPopupType('alarm')}
          />

        </SelectRowContainer>
      </ContentArea>

      <BtnWrapper>
        <Btn
          text="다음"
          onClick={() => navigate('/time-recommend')}
        />
      </BtnWrapper>

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
    </PageWrapper>
  );
}