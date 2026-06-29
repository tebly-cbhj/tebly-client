import styled from 'styled-components';
import { CATEGORY_ICONS } from '../room/CategoryIcons';

const Card = styled.div`
  display: flex;
  width: 100%;
  height: 88px;
  padding: 16px 20px;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
  cursor: pointer;  /* ✅ 추가 */
  background: ${({ $isRead, theme }) =>
    $isRead ? 'transparent' : theme.colors.primary10};
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
`;

const ProfileImage = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
  flex: 1 0 0;
`;

const MessageText = styled.p`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0;
`;

const BoldText = styled.span`
  ${({ theme }) => theme.typography.body3};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray900};
`;

const TimeText = styled.span`
  ${({ theme }) => theme.typography.caption2};
  color: ${({ theme }) => theme.colors.gray500};
`;

function getEulReul(word) {
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);
  // 한글 받침 여부 확인 ((code - 0xAC00) % 28 === 0 이면 받침 없음)
  const hasFinalConsonant = (code - 0xAC00) % 28 !== 0;
  return hasFinalConsonant ? '을' : '를';
}

export default function NotiCard({
  onClick,
  categoryId,
  type,             // 'schedule' | 'appointment' | 'poke'
  scheduleName,
  roomName,
  timeLeft,
  notifiedAt,
  isRead = false,
  pokerName,        // 콕 찌른 사람 이름
  pokerProfileImage, // 콕 찌른 사람 프사
  userName,         // 현재 사용자 이름
}) {
  const categoryIcon = CATEGORY_ICONS.find((c) => c.id === categoryId);
  const Icon = categoryIcon?.Icon;

  return (
    <Card $isRead={isRead} onClick={onClick}> 
      {/* 왼쪽 아이콘/프사 */}
      {type === 'poke' ? (
        <ProfileImage>
          {pokerProfileImage
            ? <img src={pokerProfileImage} alt={pokerName} />
            : null // TODO: 기본 프로필 이미지 연동
          }
        </ProfileImage>
      ) : (
        <IconWrapper>
          {Icon && <Icon width={48} height={48} />}
        </IconWrapper>
      )}

      {/* 오른쪽 텍스트 */}
      <TextContainer>
        <MessageText>
          {type === 'schedule' && (
            <>
              <BoldText>{scheduleName}</BoldText>까지 {timeLeft} 남았어요!
            </>
          )}
          {type === 'appointment' && (
            <>
              <BoldText>{roomName}</BoldText>의 <BoldText>{scheduleName}</BoldText>까지 {timeLeft} 남았어요!
            </>
          )}
          {type === 'poke' && (
            <>
              <BoldText>{pokerName}</BoldText>님이 <BoldText>{userName}</BoldText>
              {getEulReul(userName)} 콕 찔렀어요. <BoldText>{scheduleName}</BoldText>
              {getEulReul(scheduleName)} 확인해보러가요.
            </>
          )}
        </MessageText>
        <TimeText>{notifiedAt}</TimeText>
      </TextContainer>
    </Card>
  );
}