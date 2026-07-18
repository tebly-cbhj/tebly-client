import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Toggle from '../../components/common/Toggle';
import SelectRow from '../../components/room/SelectRow';
import DatePopup from '../../components/room/DatePopup';
import CategoryPopup from '../../components/room/CategoryPopup';
import AlarmPopup from '../../components/room/AlarmPopup';
import RepeatPopup from '../../components/room/RepeatPopup';
import RepeatEndDatePopup from '../../components/room/RepeatEndDatePopup';
import ExpandIcon from '../../components/common/ExpandIcon';
import TimePicker from '../../components/common/TimePicker';
import { CATEGORY_ICON_MAP } from '../../components/room/CategoryIcons';
import { useOCRScheduleStore } from '../../store/OCRScheduleStore';

import CloseIcon from '../../assets/icons/close-m.svg?react';
import ClockIcon from '../../assets/icons/clock.svg?react';
import PlaceIcon from '../../assets/icons/place.svg?react';
import CategoryIconSvg from '../../assets/icons/category.svg?react';
import BellIcon from '../../assets/icons/bell-line.svg?react';
import RepeatIconSvg from '../../assets/icons/repeat.svg?react';

const EditHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 12px 20px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const CloseBtn = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray900};
`;

const SaveBtn = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  ${({ theme }) => theme.typography.btn2};
  color: ${({ theme }) => theme.colors.primary100};
`;

const TopCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px 20px 20px;
  width: 100%;
  box-sizing: border-box;
`;

const CategoryCircle = styled.div`
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TopTextArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const InlineField = styled.input`
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  padding: 0;
  ${({ $isTitle, theme }) => $isTitle ? theme.typography.s1 : theme.typography.body3};
  color: ${({ $isEmpty, theme }) => $isEmpty ? theme.colors.gray500 : theme.colors.gray900};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.gray100};
  flex-shrink: 0;
`;

const ScrollContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
  &::-webkit-scrollbar { display: none; }
`;

const DateTimeSection = styled.div`
  width: 100%;
  padding: 16px 0;
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
  ${({ theme }) => theme.typography.s2};
  color: ${({ theme }) => theme.colors.gray900};
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
  width: 100%;
  max-width: 490px;
  background: ${({ theme }) => theme.colors.white};
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
  background: ${({ theme }) => theme.colors.gray300};
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
  background: ${({ theme }) => theme.colors.gray200};
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray800};
  cursor: pointer;
`;

const ConfirmBtn = styled.button`
  flex: 1;
  height: 2.75rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.primary100};
  ${({ theme }) => theme.typography.btn1};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
`;

const SelectRowContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
`;

const RepeatSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: 1.25rem;
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
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.effects.shadow2};
`;

const FabMenuItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  text-align: left;
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray900};
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
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray900};
`;

const RepeatEndValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RepeatEndText = styled.span`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray800};
`;

const DAY_FULL = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

function toDisplayDate(dateObj) {
  if (!dateObj) return '';
  const d = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
  return `${dateObj.month}월 ${dateObj.day}일 ${DAY_FULL[d.getDay()]}`;
}

function computeTimeDisplay(startDate, startTime, endTime) {
  if (!startDate) return `${startTime}~${endTime}`;
  const d = new Date(startDate.year, startDate.month - 1, startDate.day);
  return `${DAY_KO[d.getDay()]}요일 ${startTime}~${endTime}`;
}

export default function OCREditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scheduleId } = location.state || {};

  const { schedules, updateSchedule } = useOCRScheduleStore();
  const schedule = schedules.find((s) => s.id === scheduleId) || {};

  const [title, setTitle] = useState(schedule.title || '');
  const [memo, setMemo] = useState(schedule.memo || '');
  const [category, setCategory] = useState(schedule.category || null);
  const [allDay, setAllDay] = useState(schedule.allDay || false);
  const [startDate, setStartDate] = useState(schedule.startDate || null);
  const [endDate, setEndDate] = useState(schedule.endDate || null);
  const [startTime, setStartTime] = useState(schedule.startTime || '09:00');
  const [endTime, setEndTime] = useState(schedule.endTime || '10:00');
  const [place, setPlace] = useState(schedule.place || '');
  const [alarmTime, setAlarmTime] = useState(schedule.alarmTime || '');
  const [repeat, setRepeat] = useState(schedule.repeat || '없음');
  const [repeatEnd, setRepeatEnd] = useState('안 함');
  const [repeatEndDate, setRepeatEndDate] = useState(null);
  const [showRepeatEndMenu, setShowRepeatEndMenu] = useState(false);
  const [showRepeatEndDatePopup, setShowRepeatEndDatePopup] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [timePickerTarget, setTimePickerTarget] = useState(null);
  const [pendingTime, setPendingTime] = useState({ hour: '09', minute: '00' });

  const iconData = CATEGORY_ICON_MAP[category?.categoryIcon] || CATEGORY_ICON_MAP.Other;
  const CategoryIconComp = iconData.SelectedIcon;

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

  function handleSave() {
    if (!title.trim()) return;
    const newTime = computeTimeDisplay(startDate, startTime, endTime);
    updateSchedule(scheduleId, {
      title, memo, category, allDay, startDate, endDate,
      startTime, endTime, place, alarmTime, repeat, time: newTime,
    });
    navigate(-1);
  }

  return (
    <PageWrapper>
      <EditHeader>
        <CloseBtn onClick={() => navigate(-1)}>
          <CloseIcon />
        </CloseBtn>
        <SaveBtn onClick={handleSave}>저장</SaveBtn>
      </EditHeader>

      <TopCard>
        <CategoryCircle>
          <CategoryIconComp />
        </CategoryCircle>
        <TopTextArea>
          <InlineField
            $isTitle
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일정 이름"
          />
          <InlineField
            $isEmpty={!memo}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모 없음"
          />
        </TopTextArea>
      </TopCard>

      <Divider />

      <ScrollContent>
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
                <DateButton $empty={!startDate} onClick={() => setPopupType('date')}>
                  {startDate ? toDisplayDate(startDate) : '시작 날짜'}
                </DateButton>
                <TimeButton onClick={() => openTimePicker('start')}>{startTime}</TimeButton>
              </DateTimeRow>
              <DateTimeRow>
                <DateButton $empty={!endDate} onClick={() => setPopupType('date')}>
                  {endDate ? toDisplayDate(endDate) : '종료 날짜'}
                </DateButton>
                <TimeButton onClick={() => openTimePicker('end')}>{endTime}</TimeButton>
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
            LeftIcon={CategoryIconSvg}
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
              LeftIcon={RepeatIconSvg}
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

      {popupType === 'date' && (
        <DatePopup
          onClose={() => setPopupType(null)}
          onReset={() => { setStartDate(null); setEndDate(null); setPopupType(null); }}
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
          onSelect={(value) => { setCategory(value); setPopupType(null); }}
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
          onSelect={(value) => { setAlarmTime(value.join(', ')); setPopupType(null); }}
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