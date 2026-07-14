import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScheduleStore } from '../../store/ScheduleStore';
import { MINUTES_TO_ALARM } from '../../store/PersonalScheduleStore';
import apiClient from '../../api/client';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import SelectRow from '../../components/room/SelectRow';
import ProfileItem from '../../components/room/ProfileItem';
import ChipFilter from '../../components/room/ChipFilter';
import Btn from '../../components/common/Btn';
import ActionSheet from '../../components/common/ActionSheet';
import ScheduleInfo from '../../components/room/ScheduleInfo';
import PokePopup from '../../components/room/PokePopup';
import DatePopup from '../../components/room/DatePopup';
import TimePickerPopup from '../../components/room/TimePickerPopup';
import MinTimePickerPopup from '../../components/room/MinTimePickerPopup';

import PlaceIcon from '../../assets/icons/place.svg?react';
import CategoryIcon from '../../assets/icons/category.svg?react';
import BellIcon from '../../assets/icons/bell-line.svg?react';
import FriendsIcon from '../../assets/icons/friends.svg?react';
import CalendarCheckIcon from '../../assets/icons/calendar-check.svg?react';

import { CATEGORY_ICON_MAP } from '../../components/room/CategoryIcons';

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CardWrapper = styled.div`
  margin-top: 12px;
`;

const SelectRowWrapper = styled.div`
  margin-top: 12px;
  padding: 0 20px;
`;

const MyResponseRow = styled.div`
  display: flex;
  padding: 20px 0;
  align-items: center;
  gap: 8px;
  align-self: stretch;
`;

const AttendanceRow = styled.div`
  display: flex;
  width: 21.875rem;
  padding: 1.25rem 0;
  align-items: center;
  justify-content: space-between;
`;

const IconWrapper = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const Text = styled.span`
  ${({ theme }) => theme.typography.body2}
  color: ${({ $state, theme }) =>
    $state === 'empty' ? theme.colors.gray800 : theme.colors.gray900};
  flex-shrink: 0;
`;

const ChipArea = styled.div`
  display: inline-flex;
  gap: 0.5rem;
  overflow-x: auto;
  &::-webkit-scrollbar { display: none; }
  margin-left: auto;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AttendanceWrapper = styled.div`
  margin-top: 4px;
  display: inline-flex;
  padding: 8px 20px;
  align-items: flex-start;
  gap: 16px;
  overflow-x: auto;
  width: 100%;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const BtnWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 440px;
  padding: 12px 20px 34px 20px;
  box-sizing: border-box;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.25rem;
  background: ${({ theme }) => theme.colors.gray900};
  border-radius: 0.75rem;
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.white};
  white-space: nowrap;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 200;
`;

const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];
const STATUS_LABEL_TO_ENUM = { '참석': 'ACCEPTED', '불참': 'REJECTED', '미응답': 'PENDING' };
const pad = (n) => String(n).padStart(2, '0');

function formatDateLabel(isoDateTime) {
  const d = new Date(isoDateTime);
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${y}.${m}.${day} (${WEEKDAY_KO[d.getDay()]})`;
}

function formatTimeLabel(startTimeIso, endTimeIso) {
  const start = new Date(startTimeIso);
  const end = new Date(endTimeIso);
  return `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())}`;
}

function buildIsoDateTime(dateObj, hour, minute) {
  return `${dateObj.year}-${pad(dateObj.month)}-${pad(dateObj.day)}T${pad(Number(hour))}:${pad(Number(minute))}:00`;
}

function parseDateString(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month, day };
}

export default function MyAppointmentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const categories = useScheduleStore((state) => state.categories);
  const fetchCategories = useScheduleStore((state) => state.fetchCategories);

  const promiseId = location.state?.promiseId;
  const isInvited = location.state?.isInvited ?? false;

  const [promise, setPromise] = useState(null);

  const fetchDetail = useCallback(async () => {
    const res = await apiClient.get(`/promises/${promiseId}`);
    setPromise(res.data);
  }, [promiseId]);

  useEffect(() => {
    fetchCategories();
    fetchDetail();
  }, [fetchCategories, fetchDetail]);

  const [selectedChip, setSelectedChip] = useState(null);
  const [myResponse, setMyResponse] = useState(null); // 'ACCEPTED' | 'REJECTED'
  const [isEditing, setIsEditing] = useState(isInvited);
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showMinTimePicker, setShowMinTimePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pendingDate, setPendingDate] = useState(null);
  const [pendingStart, setPendingStart] = useState(null);
  const [pendingStartTimeIso, setPendingStartTimeIso] = useState(null);
  const [pendingEndTimeIso, setPendingEndTimeIso] = useState(null);
  const [displayTime, setDisplayTime] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000);
  }

  useEffect(() => {
    if (promise) {
      setMyResponse(promise.myStatus === 'PENDING' ? null : promise.myStatus);
      setDisplayTime(formatTimeLabel(promise.startTime, promise.endTime));
    }
  }, [promise]);

  if (!promise) return null; // TODO: 로딩 스피너로 교체

  const categoryIcon = categories.find((c) => c.categoryId === promise.myCategoryId)?.categoryIcon;
  const filteredMembers = selectedChip
    ? promise.members.filter((m) => m.status === STATUS_LABEL_TO_ENUM[selectedChip])
    : promise.members;

  async function handlePrimaryAction() {
    if (isInvited) {
      await apiClient.patch(`/promises/${promiseId}/invitations/me`, { status: myResponse });
      showToast('저장을 완료했어요.');
      setTimeout(() => navigate(-1), 700);
    } else if (isEditing) {
      if (pendingStartTimeIso && pendingEndTimeIso) {
        await apiClient.patch(`/promises/${promiseId}`, {
          title: promise.title,
          comment: promise.comment,
          categoryId: promise.myCategoryId,
          proposeStartDate: promise.proposeStartDate,
          proposeEndDate: promise.proposeEndDate,
          startTime: pendingStartTimeIso,
          endTime: pendingEndTimeIso,
          location: promise.location,
          notificationLeadMinutes: promise.notificationLeadMinutes,
          minDuration: promise.minDuration,
        });
      }
      setIsEditing(false);
      fetchDetail();
    } else {
      try {
        await apiClient.patch(`/promises/${promiseId}/confirm`);
        await fetchDetail();
        showToast('약속이 확정되었어요!');
      } catch (err) {
        showToast(err.message || '약속 확정에 실패했어요.');
      }
    }
  }

  const isAlreadyConfirmed = !isEditing && !isInvited && promise.promiseStatus === 'CONFIRMED';

  async function handleDelete() {
    await apiClient.delete(`/promises/${promiseId}`);
    setIsSheetOpen(false);
    navigate(-1);
  }

  return (
    <PageWrapper noNav>
      <Header
        title=""
        leftIcon="close"
        onLeft={() => navigate(-1)}
        icons={isInvited ? [] : ['more']}
        onIconClick={(icon) => {
          if (icon === 'more') setIsSheetOpen(true);
        }}
      />

      <ContentArea>
        <CardWrapper>
          <ScheduleInfo
            title={promise.title}
            date={formatDateLabel(promise.startTime)}
            time={displayTime}
            CategoryImage={CATEGORY_ICON_MAP[categoryIcon]?.SelectedIcon}
            isEditing={isEditing}
            onEditTime={() => setShowDateSheet(true)}
          />
        </CardWrapper>

        <SelectRowWrapper>
          <SelectRow
            LeftIcon={PlaceIcon}
            text_empty="약속 장소"
            text_selected={promise.location}
            state={promise.location ? 'selected' : 'empty'}
          />
          <SelectRow
            LeftIcon={CategoryIcon}
            text_empty="카테고리"
            text_selected={promise.categoryName}
            state={promise.categoryName ? 'selected' : 'empty'}
          />
          <SelectRow
            LeftIcon={BellIcon}
            text_empty="알람을 줄 시간"
            text_selected={(promise.notificationLeadMinutes || [])
              .map((minutes) => MINUTES_TO_ALARM[minutes])
              .filter(Boolean)
              .join(', ')}
            state={promise.notificationLeadMinutes?.length ? 'selected' : 'empty'}
          />

          <MyResponseRow>
            <IconWrapper>
              <CalendarCheckIcon />
            </IconWrapper>
            <Text $state="selected">내 응답</Text>
            <ChipArea>
              {[{ label: '참석', value: 'ACCEPTED' }, { label: '불참', value: 'REJECTED' }].map(({ label, value }) => (
                <ChipFilter
                  key={value}
                  text={label}
                  selected={myResponse === value}
                  onClick={isEditing ? () => setMyResponse(myResponse === value ? null : value) : undefined}
                />
              ))}
            </ChipArea>
          </MyResponseRow>

          <AttendanceRow>
            <LeftSection>
              <IconWrapper>
                <FriendsIcon />
              </IconWrapper>
              <Text $state={promise.totalMemberCount > 0 ? 'selected' : 'empty'}>
                {promise.totalMemberCount > 0 ? `초대 ${promise.totalMemberCount}명` : '초대한 인원'}
              </Text>
            </LeftSection>
            <ChipArea>
              {['참석', '불참', '미응답'].map((label) => (
                <ChipFilter
                  key={label}
                  text={label}
                  selected={selectedChip === label}
                  onClick={() => setSelectedChip(selectedChip === label ? null : label)}
                />
              ))}
            </ChipArea>
          </AttendanceRow>
        </SelectRowWrapper>

        <AttendanceWrapper>
          {filteredMembers.map((member) => (
            <ProfileItem
              key={member.promiseMemberId}
              name={member.nickname}
              src={member.profileImageUrl}
              onClick={() => {
                if (member.status === 'PENDING') setSelectedMember(member);
              }}
            />
          ))}
        </AttendanceWrapper>

        {!isAlreadyConfirmed && (
          <BtnWrapper>
            <Btn
              text={isEditing ? '응답 저장' : isInvited ? '응답 완료' : '약속 확정'}
              onClick={handlePrimaryAction}
            />
          </BtnWrapper>
        )}

        <Toast $visible={!!toastMessage}>{toastMessage}</Toast>

        <ActionSheet
          visible={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          option1Text="수정"
          option2Text="일정 삭제"
          option2Color="#E31818"
          onOption1={() => { setIsSheetOpen(false); setIsEditing(true); }}
          onOption2={handleDelete}
        />

        {selectedMember && (
          <PokePopup
            onClose={() => setSelectedMember(null)}
            onPoke={async () => {
              await apiClient.post(`/promises/${promiseId}/poke`, { targetUserId: selectedMember.userId });
              setSelectedMember(null);
            }}
          />
        )}

        {showMinTimePicker && (
          <MinTimePickerPopup
            onClose={() => setShowMinTimePicker(false)}
            confirmText="추천 받기"
            onConfirm={({ hour, minute }) => {
              setShowMinTimePicker(false);
              navigate('/time-recommend', {
                state: {
                  promiseId,
                  title: promise.title,
                  proposeStartDate: parseDateString(promise.proposeStartDate),
                  proposeEndDate: parseDateString(promise.proposeEndDate),
                  minDuration: Number(hour) * 60 + Number(minute),
                },
              });
            }}
          />
        )}

        {showStartPicker && (
          <TimePickerPopup
            title="시작 시간"
            onClose={() => setShowStartPicker(false)}
            onConfirm={(time) => {
              setPendingStart(time);
              setShowStartPicker(false);
              setShowEndPicker(true);
            }}
          />
        )}

        {showEndPicker && (
          <TimePickerPopup
            title="종료 시간"
            onClose={() => setShowEndPicker(false)}
            onConfirm={({ hour, minute }) => {
              const startIso = buildIsoDateTime(pendingDate, pendingStart.hour, pendingStart.minute);
              const endIso = buildIsoDateTime(pendingDate, hour, minute);
              setPendingStartTimeIso(startIso);
              setPendingEndTimeIso(endIso);
              setDisplayTime(`${pad(Number(pendingStart.hour))}:${pad(Number(pendingStart.minute))} - ${pad(Number(hour))}:${pad(Number(minute))}`);
              setShowEndPicker(false);
            }}
          />
        )}

        {showDateSheet && (
          <DatePopup
            onClose={() => setShowDateSheet(false)}
            leftBtnText="시간 수정"
            rightBtnText="시간 추천"
            singleSelect
            onLeftBtn={({ start }) => {
              setPendingDate(start);
              setShowDateSheet(false);
              setShowStartPicker(true);
            }}
            onRightBtn={() => {
              setShowDateSheet(false);
              setShowMinTimePicker(true);
            }}
          />
        )}
      </ContentArea>
    </PageWrapper>
  );
}