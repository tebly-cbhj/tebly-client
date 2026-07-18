import styled from 'styled-components';
import DefaultProfile from '../../assets/default/profile/basic.svg';
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
  align-items: center;
  z-index: 9999;
`;

const Sheet = styled.div`
  width: 390px;
  max-width: 100%;
  max-height: 75vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-radius: 32px 32px 0 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -12px 20px 0 rgba(72, 72, 72, 0.2);
`;

const DragHandleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
  flex-shrink: 0;

  svg {
    display: block;
  }
`;

const Title = styled.h3`
  margin: 16px 0 0;
  ${({ theme }) => theme.typography.h3};
  color: ${({ theme }) => theme.colors.gray900};
  text-align: center;
  flex-shrink: 0;
`;

const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 20px 44px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionLabel = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray800};
`;

const MemberRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.gray300};
  background-image: url("${({ $imgUrl }) => $imgUrl}");
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
`;

const MemberName = styled.span`
  ${({ theme }) => theme.typography.s2};
  color: ${({ theme }) => theme.colors.gray900};
`;

export default function RoomMemberSheet({ onClose, members = [] }) {
  const joinedMembers = members.filter((m) => m.status === 'ACCEPTED');
  const host = joinedMembers.find((m) => m.role === 'HOST');
  const sortedMembers = [...joinedMembers].sort((a, b) => a.nickname.localeCompare(b.nickname, 'ko'));

  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <DragHandleWrapper>
          <DragHandleIcon />
        </DragHandleWrapper>

        <Title>멤버</Title>

        <ScrollArea>
          {host && (
            <Section>
              <SectionLabel>방장</SectionLabel>
              <MemberRow>
                <Avatar $imgUrl={host.profileImageUrl ?? host.profileImage ?? DefaultProfile} />
                <MemberName>{host.nickname}</MemberName>
              </MemberRow>
            </Section>
          )}

          <Section>
            <SectionLabel>멤버 {sortedMembers.length}명</SectionLabel>
            {sortedMembers.map((member) => (
              <MemberRow key={member.userId}>
                <Avatar $imgUrl={member.profileImageUrl ?? member.profileImage ?? DefaultProfile} />
                <MemberName>{member.nickname}</MemberName>
              </MemberRow>
            ))}
          </Section>
        </ScrollArea>
      </Sheet>
    </Overlay>
  );
}
