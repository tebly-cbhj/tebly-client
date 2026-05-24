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
  background: ${(props) => props.theme.colors.red50}; 
`;

// 방 이름, 설명 부분
const BottomArea = styled.div`
  display: flex;
  height: 94px;
  padding: 12px 20px 20px 20px;
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
`;

// description 부분
const DescRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
  flex: 1; 
`;

const DescText = styled.span`
  color: ${(props) => props.theme.colors.gray800}; /* [cite: 1009] */
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

export default function RoomListCard({ title, description, avatars }) {
  return (
    <CardWrapper>
      <TopArea />
      <BottomArea>
        <Title>{title}</Title>
        <DescRow>
          <DescText>{description}</DescText>
          <AvatarGroup>
            {avatars && avatars.map((imgUrl, index) => (
              <Avatar key={index} $imgUrl={imgUrl} />
            ))}
          </AvatarGroup>
        </DescRow>
      </BottomArea>
    </CardWrapper>
  );
}