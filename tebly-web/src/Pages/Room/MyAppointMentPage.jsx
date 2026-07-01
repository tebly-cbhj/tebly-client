import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScheduleStore } from '../../store/ScheduleStore';
import { useRoomStore } from '../../store/RoomStore';
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

// styled 컴포넌트 추가
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


export default function MyAppointmentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const scheduleId = location.state?.scheduleId;
  const roomId = location.state?.roomId;
  const isInvited = location.state?.isInvited ?? false;

  const schedule = useScheduleStore((state) =>
    state.schedules.find((s) => s.id === scheduleId)
  );
  const deleteSchedule = useScheduleStore((state) => state.deleteSchedule);

  const room = useRoomStore((state) =>
    state.rooms.find((r) => r.id === roomId)
  );

  // RoomStore 멤버에서 schedule.memberIds에 해당하는 사람만 필터링
  const scheduleMembers = room?.members.filter(m => schedule?.memberIds.includes(m.id)) ?? [];
  const totalCount = schedule?.memberIds.length ?? 0;

  const [selectedChip, setSelectedChip] = useState(null);
  // TODO: GET /api/appointments/:id/my-response — 초기 응답 상태 API 연동 후 교체
  // TODO: PATCH /api/appointments/:id/my-response — 응답 변경 시 API 호출 연동
  const [myResponse, setMyResponse] = useState(null); // 'participated' | 'absent'
  const [isEditing, setIsEditing] = useState(isInvited);
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showMinTimePicker, setShowMinTimePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pendingDate, setPendingDate] = useState(null);
  const [pendingStart, setPendingStart] = useState(null);
  const [displayTime, setDisplayTime] = useState(schedule?.time ?? '');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

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
          {schedule && (
            <ScheduleInfo
              title={schedule.title}
              date={schedule.date}
              time={displayTime}
              CategoryImage={CATEGORY_ICON_MAP[schedule.category]?.SelectedIcon}
              isEditing={isEditing}
              onEditTime={() => setShowDateSheet(true)}
            />
          )}
        </CardWrapper>

        <SelectRowWrapper>
          <SelectRow
            LeftIcon={PlaceIcon}
            text_empty="약속 장소"
            text_selected={schedule?.location}
            state={schedule?.location ? 'selected' : 'empty'}
          />
          <SelectRow
            LeftIcon={CategoryIcon}
            text_empty="카테고리"
            text_selected={schedule?.category}
            state={schedule?.category ? 'selected' : 'empty'}
          />
          <SelectRow
            LeftIcon={BellIcon}
            text_empty="알람을 줄 시간"
            text_selected={schedule?.alarmTime}
            state={schedule?.alarmTime ? 'selected' : 'empty'}
          />

          <MyResponseRow>
            <IconWrapper>
              <CalendarCheckIcon />
            </IconWrapper>
            <Text $state="selected">내 응답</Text>
            <ChipArea>
              {[{ label: '참석', value: 'participated' }, { label: '불참', value: 'absent' }].map(({ label, value }) => (
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
              <Text $state={totalCount > 0 ? 'selected' : 'empty'}>
                {totalCount > 0 ? `초대 ${totalCount}명` : '초대한 인원'}
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
          {scheduleMembers.map((member) => (
            <ProfileItem
              key={member.id}
              name={member.name}
              src={member.profileImage}
              onClick={() => setSelectedMember(member)}
            />
          ))}
        </AttendanceWrapper>

        <BtnWrapper>
          <Btn
            text={isEditing ? '응답 저장' : isInvited ? '응답 완료' : '약속 확정'}
            onClick={isEditing ? () => setIsEditing(false) : undefined}
          />
        </BtnWrapper>

        <ActionSheet
          visible={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          option1Text="수정"
          option2Text="일정 삭제"
          option2Color="#E31818"
          onOption1={() => { setIsSheetOpen(false); setIsEditing(true); }}
          onOption2={() => {
            deleteSchedule(scheduleId);
            setIsSheetOpen(false);
            navigate(-1);
          }}
        />

        {selectedMember && (
          <PokePopup
            onClose={() => setSelectedMember(null)}
            onPoke={() => setSelectedMember(null)}
          />
        )}

        {showMinTimePicker && (
          <MinTimePickerPopup
            onClose={() => setShowMinTimePicker(false)}
            confirmText="추천 받기"
            onConfirm={(time) => {
              setShowMinTimePicker(false);
              navigate('/time-recommend', { state: { minTime: time } });
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
              const fmt = (h, m) =>
                `${String(Number(h)).padStart(2, '0')}:${String(Number(m)).padStart(2, '0')}`;
              const newTime = `${fmt(pendingStart.hour, pendingStart.minute)} - ${fmt(hour, minute)}`;
              // TODO: PATCH /api/appointments/:id — { date: pendingDate, startTime, endTime } 연동
              setDisplayTime(newTime);
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