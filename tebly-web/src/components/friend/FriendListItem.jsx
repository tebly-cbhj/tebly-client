import styled from 'styled-components';
import IconStar from './IconStar';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 72px;
  padding: 12px 20px;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
`;

const ProfileRow = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
`;

const ProfileImage = styled.div`
  width: 48px;
  height: 48px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TextArea = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Name = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.025rem;
  color: #1A1A1A;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Intro = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.02188rem;
  color: #525252;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StarBtn = styled.button`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function FriendListItem({
  name,
  intro,
  profileImage,
  isFavorite = false,
  onToggleFavorite,
  onClick,
}) {
  return (
    <Container onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <ProfileRow>
        <ProfileImage>
          {profileImage ? (
            <img src={profileImage} alt={name} />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#DCDCDC" />
            </svg>
          )}
        </ProfileImage>
        <TextArea>
          <Name>{name}</Name>
          {intro && <Intro>{intro}</Intro>}
        </TextArea>
      </ProfileRow>
      <StarBtn
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.();
        }}
      >
        <IconStar active={isFavorite} />
      </StarBtn>
    </Container>
  );
}
