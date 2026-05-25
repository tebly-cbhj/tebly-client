import styled from 'styled-components';

const CardWrapper = styled.div`
  display: flex;
  width: 350px;
  height: 272px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(68, 68, 68, 0.16);
  overflow: hidden; 
  cursor: pointer;
`;

// 이미지 혹은 기본 색상 부분
const TopArea = styled.div`
  height: 177px;
  flex-shrink: 0;
  align-self: stretch;
  background: ${(props) => props.theme.colors.primary50}; 
`;

// 방 이름, 설명 부분
const BottomArea = styled.div`
  display: flex;
  height: 94px;
  padding: 16px 20px 20px 20px;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  align-self: stretch;
  background: ${(props) => props.theme.colors.white}; 
`;

// 방 이름
const Title = styled.h2`
  margin: 0;
  align-self: stretch;
  color: ${(props) => props.theme.colors.gray900};
  ${(props) => props.theme.typography.h2}
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  min-height: 34px;
`;

// description 부분
const DescRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const DescText = styled.span`
  color: ${(props) => props.theme.colors.gray800};
  ${(props) => props.theme.typography.body2}
`;

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
`;

// 참여 인원 프로필
const Avatar = styled.div`
  width: 33px;
  height: 33px;
  border-radius: 33px;
  background-color: ${(props) => props.theme.colors.gray500}; 
  background-image: ${(props) => (props.$imgUrl ? `url(${props.$imgUrl})` : 'none')};
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  margin-left: -12px; 
  border: 1.5px solid ${(props) => props.theme.colors.white}; 

  &:first-child {
    margin-left: 0; 
  }
`;

// 추가 인원수 관련 스타일
const ExtraCount = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.gray900}80; 
  color: ${(props) => props.theme.colors.white};
  ${(props) => props.theme.typography.caption1}
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function RoomListCard({ title, description, avatars }) {
  const MAX_VISIBLE = 3;  // 최대 3명까지만 표시
  const visibleAvatars = avatars ? avatars.slice(0, MAX_VISIBLE) : [];
  const extraCount = avatars ? avatars.length - MAX_VISIBLE : 0;

  return (
    <CardWrapper>
      <TopArea />
      <BottomArea>
        <Title>{title}</Title>
        <DescRow>
          <DescText>{description}</DescText>
          <AvatarGroup>
            {visibleAvatars.map((imgUrl, index) => (
              <Avatar key={index} $imgUrl={imgUrl} $isLast={index === visibleAvatars.length - 1}>
                {/* 마지막 프사 위에 +n 표시 */}
                {index === visibleAvatars.length - 1 && extraCount > 0 && (
                  <ExtraCount>+{extraCount}</ExtraCount>
                )}
              </Avatar>
            ))}
          </AvatarGroup>
        </DescRow>
      </BottomArea>
    </CardWrapper>
  );
}