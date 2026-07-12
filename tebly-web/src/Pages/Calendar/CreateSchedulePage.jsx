import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import Textfield from '../../components/common/Textfield';
import Toggle from '../../components/common/Toggle';
import SelectRow from '../../components/room/SelectRow';
import Btn from '../../components/common/Btn';
import DatePopup from '../../components/room/DatePopup';
import CategoryPopup from '../../components/room/CategoryPopup';
import AlarmPopup from '../../components/room/AlarmPopup';
import RepeatPopup from '../../components/room/RepeatPopup';
import RepeatEndDatePopup from '../../components/room/RepeatEndDatePopup';
import ExpandIcon from '../../components/common/ExpandIcon';
import TimePicker from '../../components/common/TimePicker';
import apiClient from '../../api/client';
import { ALARM_TO_MINUTES } from '../../store/PersonalScheduleStore';

import ClockIcon from '../../assets/icons/clock.svg?react';
import PlaceIcon from '../../assets/icons/place.svg?react';
import CategoryIcon from '../../assets/icons/category.svg?react';
import BellIcon from '../../assets/icons/bell-line.svg?react';
import RepeatIcon from '../../assets/icons/repeat.svg?react';

const ScrollContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 5rem;
  &::-webkit-scrollbar { display: none; }
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0.5rem 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  box-sizing: border-box;
`;

const Label = styled.span`
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
`;

const DateTimeSection = styled.div`
  width: 100%;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
`;

const AllDayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AllDayContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AllDayLabel = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.025rem;
  color: #1A1A1A;
`;

const DateTimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 32px;
`;

const DateButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  ${({ theme }) => theme.typography.body2};
  color: ${({ $empty, theme }) => $empty ? theme.colors.gray500 : theme.colors.gray900};
`;

const TimeButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray900};
`;

const TimePickerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const TimePickerSheet = styled.div`
  width: 390px;
  background: var(--grayscale-white, #fefefe);
  border-radius: 2rem 2rem 0 0;
  box-shadow: 0 -4px 12px 0 rgba(68, 68, 68, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1.6875rem 2.125rem;
`;

const DragHandle = styled.div`
  width: 3rem;
  height: 0.3125rem;
  background: #dcdcdc;
  border-radius: 2.5px;
  margin-top: 0.75rem;
  margin-bottom: 2.625rem;
  flex-shrink: 0;
`;

const TimePickerActions = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-top: 2.5rem;
`;

const CancelBtn = styled.button`
  width: 7.5rem;
  flex-shrink: 0;
  height: 2.75rem;
  border: none;
  border-radius: 0.5rem;
  background: #efefef;
  font-size: 1rem;
  font-family: 'Pretendard Variable';
  font-weight: 400;
  color: #525252;
  cursor: pointer;
`;

const ConfirmBtn = styled.button`
  flex: 1;
  height: 2.75rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.primary100};
  font-size: 1rem;
  font-family: 'Pretendard Variable';
  font-weight: 600;
  color: #fefefe;
  cursor: pointer;
`;

const RepeatEndWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const FabMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
`;

const FabMenu = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 101;
  display: flex;
  width: 9.6875rem;
  padding: 1.25rem 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  border-radius: 0.5rem;
  background: #FEFEFE;
  box-shadow: 0 0 12px 0 rgba(68, 68, 68, 0.16);
`;

const FabMenuItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  text-align: left;
  font-family: 'Pretendard Variable';
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.02188rem;
  color: #1A1A1A;
`;

const RepeatSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: 1.25rem;
  
`;

const RepeatEndRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 2rem;
  width: 100%;
  cursor: pointer;
  box-sizing: border-box;
  
`;

const RepeatEndLabel = styled.span`
  color: var(--grayscale-gray-900, #1A1A1A);

  /* body2 */
  font-family: 'Pretendard Variable';
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 1.4rem */
  letter-spacing: -0.025rem;
  
`;

const RepeatEndValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  
`;

const RepeatEndText = styled.span`
  color: var(--grayscale-gray-800, #525252);
  /* body2 */
  font-family: 'Pretendard Variable';
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 1.4rem */
  letter-spacing: -0.025rem;
`;


const SelectRowContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
`;

const BtnWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 390px;
  padding: 0.75rem 1.25rem 2rem;
  background: ${({ theme }) => theme.colors.bg};
  box-sizing: border-box;
  z-index: 10;
`;

const DAY_FULL = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function toDisplayDate(dateObj) {
  if (!dateObj) return '';
  const d = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
  return `${dateObj.month}월 ${dateObj.day}일 ${DAY_FULL[d.getDay()]}`;
}

const REPEAT_TYPE_TO_KO = { daily: '매일', weekly: '매주', monthly: '매월', yearly: '매년' };
const REPEAT_KO_TO_TYPE = { 없음: 'NONE', 매일: 'DAILY', 매주: 'WEEKLY', 매월: 'MONTHLY', 매년: 'YEARLY' };

function toIsoDateTime(dateObj, timeStr) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${dateObj.year}-${pad(dateObj.month)}-${pad(dateObj.day)}T${timeStr}:00`;
}

function getNotificationLeadMinutes(alarmTime) {
  if (!alarmTime) return [];
  return alarmTime
    .split(',')
    .map((label) => ALARM_TO_MINUTES[label.trim()])
    .filter((n) => n !== undefined);
}

function parseDateString(dateStr) {
  if (!dateStr) return null;
  const datePart = dateStr.split(' ')[0]; // '2026.08.01 (토)' 같은 형식의 요일 부분 제거
  const parts = datePart.split(/[-.]/).map(Number);
  if (parts.length >= 3 && parts[0] > 999) {
    return { year: parts[0], month: parts[1], day: parts[2] };
  }
  return null;
}

function parseRepeatString(repeat) {
  if (!repeat) return '없음';
  // PersonalScheduleStore에서 오는 반복 일정은 {type, interval, until} 객체 형태
  if (typeof repeat === 'object') return REPEAT_TYPE_TO_KO[repeat.type] || '없음';
  if (repeat === '반복 없음') return '없음';
  const match = repeat.match(/^(\w+) 반복$/);
  return match ? (REPEAT_TYPE_TO_KO[match[1]] || '없음') : '없음';
}

export default function CreateSchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scheduleId, schedule: initialSchedule } = location.state || {};
  const isEditing = !!scheduleId;

  const [title, setTitle] = useState(initialSchedule?.title || '');
  const [memo, setMemo] = useState(initialSchedule?.memo || '');
  const [allDay, setAllDay] = useState(false);
  const [startDate, setStartDate] = useState(() => parseDateString(initialSchedule?.startDate));
  const [endDate, setEndDate] = useState(() => parseDateString(initialSchedule?.endDate));
  const [startTime, setStartTime] = useState(initialSchedule?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialSchedule?.endTime || '10:00');
  const [place, setPlace] = useState(initialSchedule?.place || '');
  const [category, setCategory] = useState(initialSchedule?.category || null);
  const [alarmTime, setAlarmTime] = useState(initialSchedule?.alarmTime || '');
  const [repeat, setRepeat] = useState(() => parseRepeatString(initialSchedule?.repeat));
  const [repeatEnd, setRepeatEnd] = useState(initialSchedule?.repeat?.until ? '날짜' : '안 함');
  const [repeatEndDate, setRepeatEndDate] = useState(() => parseDateString(initialSchedule?.repeat?.until));
  const [showRepeatEndMenu, setShowRepeatEndMenu] = useState(false);
  const [showRepeatEndDatePopup, setShowRepeatEndDatePopup] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [timePickerTarget, setTimePickerTarget] = useState(null); // 'start' | 'end'
  const [pendingTime, setPendingTime] = useState({ hour: '09', minute: '00' });

  function openTimePicker(target) {
    const current = target === 'start' ? startTime : endTime;
    const [hour, minute] = current.split(':');
    setPendingTime({ hour, minute });
    setTimePickerTarget(target);
  }

  function confirmTimePicker() {
    const str = `${pendingTime.hour}:${pendingTime.minute}`;
    if (timePickerTarget === 'start') setStartTime(str);
    else setEndTime(str);
    setTimePickerTarget(null);
  }

  async function handleSave() {
    if (!title.trim() || !startDate) return;
    if (!category?.categoryId) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    const repeatType = REPEAT_KO_TO_TYPE[repeat];

    const payload = {
      categoryId: category.categoryId,
      title,
      startTime: toIsoDateTime(startDate, startTime),
      endTime: toIsoDateTime(endDate || startDate, endTime),
      repeatType,
      notificationLeadMinutes: getNotificationLeadMinutes(alarmTime),
      location: place,
      memo,
      repeatUntil: repeatEnd === '날짜' && repeatEndDate ? toIsoDateTime(repeatEndDate, '23:59') : undefined,
    };

    try {
      if (isEditing) {
        await apiClient.patch(`/schedules/events/${scheduleId}`, payload);
      } else {
        await apiClient.post('/schedules/events', payload);
      }
      navigate(-1);
    } catch {
      alert('일정 저장에 실패했어요. 다시 시도해주세요.');
    }
  }

  return (
    <PageWrapper>
      <Header title={isEditing ? '일정 수정' : '일정 추가'} leftIcon="back" onLeft={() => navigate(-1)} />

      <ScrollContent>
        <InputContainer>
          <Label>일정 이름</Label>
          <Textfield
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="이름을 적어주세요."
          />
        </InputContainer>

        <InputContainer>
          <Label>메모</Label>
          <Textfield
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="참고할 내용을 적어주세요."
          />
        </InputContainer>

        <DateTimeSection>
          <AllDayRow>
            <ClockIcon width={24} height={24} />
            <AllDayContent>
              <AllDayLabel>종일</AllDayLabel>
              <Toggle isOn={allDay} onToggle={() => setAllDay((v) => !v)} />
            </AllDayContent>
          </AllDayRow>

          {!allDay && (
            <>
              <DateTimeRow>
                <DateButton
                  $empty={!startDate}
                  onClick={() => setPopupType('date')}
                >
                  {startDate ? toDisplayDate(startDate) : '시작 날짜'}
                </DateButton>
                <TimeButton onClick={() => openTimePicker('start')}>
                  {startTime}
                </TimeButton>
              </DateTimeRow>
              <DateTimeRow>
                <DateButton
                  $empty={!endDate}
                  onClick={() => setPopupType('date')}
                >
                  {endDate ? toDisplayDate(endDate) : '종료 날짜'}
                </DateButton>
                <TimeButton onClick={() => openTimePicker('end')}>
                  {endTime}
                </TimeButton>
              </DateTimeRow>
            </>
          )}
        </DateTimeSection>

        <SelectRowContainer>
          <SelectRow
            LeftIcon={PlaceIcon}
            text_empty="장소 입력"
            text_selected={place}
            state={editingField === 'place' ? 'typing' : place ? 'selected' : 'empty'}
            value={place}
            onClick={() => setEditingField('place')}
            onChange={(e) => setPlace(e.target.value)}
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => { if (e.key === 'Enter') setEditingField(null); }}
          />
          <SelectRow
            LeftIcon={CategoryIcon}
            text_empty="카테고리 선택"
            text_selected={category?.categoryName ?? ''}
            state={category ? 'selected' : 'empty'}
            right_icon
            onClick={() => setPopupType('category')}
          />
          <SelectRow
            LeftIcon={BellIcon}
            text_empty="알림 설정"
            text_selected={alarmTime}
            state={alarmTime ? 'selected' : 'empty'}
            right_icon
            onClick={() => setPopupType('alarm')}
          />
          <RepeatSection>
            <SelectRow
              LeftIcon={RepeatIcon}
              text_empty="반복 설정"
              text_selected={repeat !== '없음' ? `${repeat} 반복` : ''}
              state={repeat !== '없음' ? 'selected' : 'empty'}
              right_icon
              onClick={() => setPopupType('repeat')}
            />
            {repeat !== '없음' && (
              <RepeatEndWrapper>
                {showRepeatEndMenu && (
                  <FabMenuOverlay onClick={() => setShowRepeatEndMenu(false)} />
                )}
                <RepeatEndRow onClick={() => setShowRepeatEndMenu((v) => !v)}>
                  <RepeatEndLabel>반복 종료</RepeatEndLabel>
                  <RepeatEndValue>
                    <RepeatEndText>
                      {repeatEndDate
                        ? `${repeatEndDate.month}월 ${repeatEndDate.day}일`
                        : repeatEnd}
                    </RepeatEndText>
                    <ExpandIcon />
                  </RepeatEndValue>
                </RepeatEndRow>
                {showRepeatEndMenu && (
                  <FabMenu>
                    {['안 함', '날짜'].map((option) => (
                      <FabMenuItem
                        key={option}
                        $selected={repeatEnd === option || (option === '날짜' && repeatEndDate !== null)}
                        onClick={() => {
                          setShowRepeatEndMenu(false);
                          if (option === '날짜') {
                            setShowRepeatEndDatePopup(true);
                          } else {
                            setRepeatEnd('안 함');
                            setRepeatEndDate(null);
                          }
                        }}
                      >
                        {option}
                      </FabMenuItem>
                    ))}
                  </FabMenu>
                )}
              </RepeatEndWrapper>
            )}
          </RepeatSection>
        </SelectRowContainer>
      </ScrollContent>

      <BtnWrapper>
        <Btn text="저장" onClick={handleSave} />
      </BtnWrapper>

      {popupType === 'date' && (
        <DatePopup
          onClose={() => setPopupType(null)}
          onReset={() => {
            setStartDate(null);
            setEndDate(null);
            setPopupType(null);
          }}
          onConfirm={(value) => {
            setStartDate(value.start);
            setEndDate(value.end ?? value.start);
            setPopupType(null);
          }}
        />
      )}

      {popupType === 'category' && (
        <CategoryPopup
          selectedCategoryId={category?.categoryId}
          onClose={() => setPopupType(null)}
          onSelect={(value) => {
            setCategory(value);
            setPopupType(null);
          }}
        />
      )}

      {timePickerTarget && (
        <TimePickerOverlay onClick={() => setTimePickerTarget(null)}>
          <TimePickerSheet onClick={(e) => e.stopPropagation()}>
            <DragHandle />
            <TimePicker value={pendingTime} onChange={setPendingTime} />
            <TimePickerActions>
              <CancelBtn onClick={() => setTimePickerTarget(null)}>취소</CancelBtn>
              <ConfirmBtn onClick={confirmTimePicker}>선택 완료</ConfirmBtn>
            </TimePickerActions>
          </TimePickerSheet>
        </TimePickerOverlay>
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

      {popupType === 'repeat' && (
        <RepeatPopup
          selected={repeat}
          onClose={() => setPopupType(null)}
          onSelect={(value) => {
            setRepeat(value);
            if (value === '없음') { setRepeatEnd('안 함'); setRepeatEndDate(null); }
            setPopupType(null);
          }}
        />
      )}

      {showRepeatEndDatePopup && (
        <RepeatEndDatePopup
          initialDate={repeatEndDate}
          onClose={() => setShowRepeatEndDatePopup(false)}
          onConfirm={(date) => {
            setRepeatEndDate(date);
            setRepeatEnd('날짜');
            setShowRepeatEndDatePopup(false);
          }}
        />
      )}

    </PageWrapper>
  );
}
