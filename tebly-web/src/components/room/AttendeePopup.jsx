import styled from 'styled-components';
import Attendee from './Attendee';
import MemberFillIcon from '../../assets/icons/member-fill.svg';
import DragHandleIcon from '../../assets/icons/drag-handle.svg?react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  z-index: 9999;
`;

const Sheet = styled.div`
  display: inline-flex;
  width: 100%;
  box-sizing: border-box;
  padding: 12px 20px 44px 20px;
  flex-direction: column;
  align-items: center;
  gap: 23px;
  border-radius: 32px 32px 0 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -12px 20px 0 rgba(72, 72, 72, 0.20);
`;

const DragHandleWrapper = styled.div`
  display: flex;
  justify-content: center;

  svg {
    display: block;
  }
`;

const SectionList = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: stretch;
`;

const SectionTitleText = styled.span`
  ${({ theme }) => theme.typography.s1};
  color: #000;
`;

const CountIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const CountText = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray900};
`;

const AttendeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: flex-start;
  align-content: flex-start;
  row-gap: 20px;
  column-gap: 32px;
  align-self: stretch;
  width: 100%;
`;

export default function TimeSlotAttendeeSheet({
  onClose,
  availableAttendees = [],
  unavailableAttendees = [],
}) {
  const totalCount = availableAttendees.length + unavailableAttendees.length;

  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <DragHandleWrapper>
          <DragHandleIcon width={48} height={5} />
        </DragHandleWrapper>

        <SectionList>
          <SectionTitleRow>
            <SectionTitleText>참석 가능</SectionTitleText>
            <CountIcon src={MemberFillIcon} alt="" />
            <CountText>{availableAttendees.length}/{totalCount}</CountText>
          </SectionTitleRow>

          <AttendeeGrid>
            {availableAttendees.map((attendee) => (
              <Attendee
                key={attendee.id}
                name={attendee.name}
                profileImage={attendee.profileImage}
                available
              />
            ))}
          </AttendeeGrid>
        </SectionList>

        <SectionList>
          <SectionTitleRow>
            <SectionTitleText>참석 불가능</SectionTitleText>
          </SectionTitleRow>

          <AttendeeGrid>
            {unavailableAttendees.map((attendee) => (
              <Attendee
                key={attendee.id}
                name={attendee.name}
                profileImage={attendee.profileImage}
                available={false}
              />
            ))}
          </AttendeeGrid>
        </SectionList>
      </Sheet>
    </Overlay>
  );
}