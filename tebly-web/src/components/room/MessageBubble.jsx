import styled from 'styled-components';

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: ${({ $type }) => $type === 'sent' ? 'flex-end' : 'flex-start'};
  ${({ $type }) => $type === 'sent' ? 'justify-content: center;' : ''}
  gap: 0.25rem;
  width: 100%;
  padding-left: ${({ $type }) => $type === 'received-hidden' ? '2.875rem' : '0'};
  /* 같은 사람이 연속으로 보낸 메시지끼리는 붙어 보이게, 발신자가 바뀌는 지점에서만
     여백을 더 줘서 그룹이 시각적으로 구분되게 함 */
  margin-top: ${({ $isGroupStart }) => ($isGroupStart ? '0.75rem' : '0')};
`;

const ReceivedRow = styled.div`
  display: inline-flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const ProfileCircle = styled.div`
  width: 2.375rem;
  height: 2.375rem;
  border-radius: 2.375rem;
  flex-shrink: 0;
  background-color: #D9D9D9;
  background-image: ${({ $image }) => ($image ? `url("${$image}")` : 'none')};
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
`;

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
`;

const SenderName = styled.span`
  ${({ theme }) => theme.typography.btn3}
  color: ${({ theme }) => theme.colors.gray800};
`;

const ReceivedBubble = styled.div`
  display: flex;
  max-width: 13.375rem;
  padding: 0.5rem 1rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.typography.caption1}
  color: ${({ theme }) => theme.colors.gray900};
  word-break: break-word;
`;

const SentBubble = styled.div`
  display: inline-flex;
  max-width: 16.125rem;
  padding: 0.5rem 1rem;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  border-radius: 1.25rem;
  background: ${({ theme }) => theme.colors.gray200};
  ${({ theme }) => theme.typography.caption1}
  color: ${({ theme }) => theme.colors.gray900};
  word-break: break-word;
`;

export default function MessageBubble({ type, senderName, text, profileImage, isGroupStart = true }) {
  if (type === 'sent') {
    return (
      <Wrapper $type="sent" $isGroupStart={isGroupStart}>
        <SentBubble>{text}</SentBubble>
      </Wrapper>
    );
  }

  if (type === 'received-hidden') {
    return (
      <Wrapper $type="received-hidden" $isGroupStart={isGroupStart}>
        <ReceivedBubble>{text}</ReceivedBubble>
      </Wrapper>
    );
  }

  // received-shown
  return (
    <Wrapper $type="received-shown" $isGroupStart={isGroupStart}>
      <ReceivedRow>
        <ProfileCircle $image={profileImage} />
        <ContentColumn>
          {senderName && <SenderName>{senderName}</SenderName>}
          <ReceivedBubble>{text}</ReceivedBubble>
        </ContentColumn>
      </ReceivedRow>
    </Wrapper>
  );
}
