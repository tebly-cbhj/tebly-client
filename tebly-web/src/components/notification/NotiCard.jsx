import styled from 'styled-components';
import { CATEGORY_ICONS } from '../room/CategoryIcons';
import DefaultProfile from '../../assets/default/profile/basic.svg';

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

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
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

// 백엔드가 주는 문장(content)엔 "n분"이 그대로 박혀있어서(12시간 전도 720분으로 뜸),
// 자연스러운 단위로 보여주려면 timeLeftMinutes(순수 숫자)로 직접 조합해야 함
function formatTimeLeft(minutes) {
  if (minutes < 60) return `${minutes}분`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}시간`;
  return `${Math.floor(minutes / 1440)}일`;
}

export default function NotiCard({
  onClick,
  categoryId,
  type,
  title,
  content,
  senderNickname,
  senderProfileImageUrl,
  scheduleName,
  timeLeftMinutes,
  notifiedAt,
  isRead = false,
}) {
  const categoryIcon = CATEGORY_ICONS.find((c) => c.id === categoryId);
  const Icon = categoryIcon?.Icon;

  return (
    <Card $isRead={isRead} onClick={onClick}>
      {type === 'POKE' ? (
        <ProfileImage src={senderProfileImageUrl || DefaultProfile} alt="" />
      ) : (
        <IconWrapper>
          {Icon && <Icon width={48} height={48} />}
        </IconWrapper>
      )}

      <TextContainer>
        <MessageText>
          {type === 'POKE' && senderNickname ? (
            <>
              <BoldText>{senderNickname}</BoldText>님이 나를 콕 찔렀어요.{' '}
              <BoldText>{scheduleName}</BoldText>약속을 확인해보러 가요.
            </>
          ) : type === 'REMINDER' && timeLeftMinutes != null ? (
            <><BoldText>{title}</BoldText>까지 {formatTimeLeft(timeLeftMinutes)} 남았어요!</>
          ) : (
            <><BoldText>{title}</BoldText> {content}</>
          )}
        </MessageText>
        <TimeText>{notifiedAt}</TimeText>
      </TextContainer>
    </Card>
  );
}
