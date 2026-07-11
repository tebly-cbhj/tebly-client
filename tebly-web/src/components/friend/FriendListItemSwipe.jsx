import { useRef, useState } from 'react';
import styled from 'styled-components';
import ButtonDelete from './ButtonDelete';
import IconStar from './IconStar';

const Wrapper = styled.div`
  width: 100%;
  height: 72px;
  overflow: hidden;
  position: relative;
`;

const SlideTrack = styled.div`
  display: flex;
  height: 100%;
  transform: translateX(${({ $offset }) => $offset}px);
  transition: ${({ $dragging }) => ($dragging ? 'none' : 'transform 0.25s ease')};
  will-change: transform;
`;

const ItemContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 100%;
  height: 72px;
  padding: 12px 20px;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  flex-shrink: 0;
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
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.025rem;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Intro = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 0.875rem;
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

const SWIPE_WIDTH = 76;
const SWIPE_THRESHOLD = 38;

export default function FriendListItemSwipe({
  name,
  intro,
  profileImage,
  isFavorite = false,
  onToggleFavorite,
  onClick,
  onDelete,
}) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(null);
  const startOffset = useRef(0);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startOffset.current = offset;
    setDragging(true);
  };

  const handleTouchMove = (e) => {
    if (startX.current === null) return;
    const delta = e.touches[0].clientX - startX.current;
    const next = Math.max(-SWIPE_WIDTH, Math.min(0, startOffset.current + delta));
    setOffset(next);
  };

  const handleTouchEnd = () => {
    setDragging(false);
    startX.current = null;
    setOffset(offset < -SWIPE_THRESHOLD ? -SWIPE_WIDTH : 0);
  };

  const handleDelete = () => {
    setOffset(0);
    onDelete?.();
  };

  return (
    <Wrapper
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <SlideTrack $offset={offset} $dragging={dragging}>
        <ItemContainer onClick={offset === 0 ? onClick : undefined} style={{ cursor: onClick && offset === 0 ? 'pointer' : 'default' }}>
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
        </ItemContainer>
        <ButtonDelete onClick={handleDelete} />
      </SlideTrack>
    </Wrapper>
  );
}
