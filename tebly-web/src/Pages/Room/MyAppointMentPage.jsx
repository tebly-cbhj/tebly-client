import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScheduleStore } from '../../store/ScheduleStore';
import { useRoomStore } from '../../store/RoomStore';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import ScheduleCard from '../../components/room/ScheduleCard';
import SelectRow from '../../components/room/SelectRow';
import ProfileItem from '../../components/room/ProfileItem';
import ChipFilter from '../../components/room/ChipFilter';
import Btn from '../../components/common/Btn';
import ActionSheet from '../../components/common/ActionSheet';

import PlaceIcon from '../../assets/icons/place.svg?react';
import CategoryIcon from '../../assets/icons/category.svg?react';
import BellIcon from '../../assets/icons/bell-line.svg?react';
import FriendsIcon from '../../assets/icons/friends.svg?react';

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

  const schedule = useScheduleStore((state) =>
    state.schedules.find((s) => s.id === scheduleId)
  );
  const deleteSchedule = useScheduleStore((state) => state.deleteSchedule);

  const room = useRoomStore((state) =>
    state.rooms.find((r) => r.id === roomId)
  );

  // RoomStore 멤버에서 schedule.memberIds에 해당하는 사람만 필터링
  const scheduleMembers = room?.members.filter(m => schedule?.memberIds.includes(m.id)) ?? [];
  const acceptedCount = schedule?.acceptedIds.length ?? 0;
  const totalCount = schedule?.memberIds.length ?? 0;

  const [selectedChip, setSelectedChip] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <PageWrapper>
      <Header
        title=""
        leftIcon="close"
        onLeft={() => navigate(-1)}
        icons={['more']}
        onIconClick={(icon) => {
          if (icon === 'more') setIsSheetOpen(true);
        }}
      />

      <ContentArea>
        <CardWrapper>
          {schedule && (
            <ScheduleCard
              title={schedule.title}
              date={schedule.date}
              location={schedule.location}
              acceptedCount={acceptedCount}
              totalCount={totalCount}
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
            />
          ))}
        </AttendanceWrapper>

        <BtnWrapper>
          <Btn text="약속 확정" />
        </BtnWrapper>

        <ActionSheet
          visible={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          option1Text="수정"
          option2Text="일정 삭제"
          option2Color="#E31818"
          onOption1={() => setIsSheetOpen(false)}
          onOption2={() => {
            deleteSchedule(scheduleId);
            setIsSheetOpen(false);
            navigate(-1);
          }}
        />
      </ContentArea>
    </PageWrapper>
  );
}