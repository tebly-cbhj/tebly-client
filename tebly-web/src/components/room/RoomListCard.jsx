import styled from 'styled-components';
import DefaultProfile from '../../assets/default/profile/basic.svg';

const CardWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 272px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(68, 68, 68, 0.16);
  overflow: hidden; 
  cursor: pointer;
`;

const TopArea = styled.div`
  height: 177px;
  flex-shrink: 0;
  align-self: stretch;
  background: ${(props) => props.theme.colors.primary50}; 
`;

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

export default function RoomListCard({ title, description, profileImages = [], totalMemberCount = 0, onClick }) {
  const MAX_VISIBLE = 3;
  const visibleAvatars = (profileImages ?? []).slice(0, MAX_VISIBLE);
  const extraCount = totalMemberCount - visibleAvatars.length;

  return (
    <CardWrapper onClick={onClick}>
      <TopArea />
      <BottomArea>
        <Title>{title}</Title>
        <DescRow>
          <DescText>{description}</DescText>
          <AvatarGroup>
            {visibleAvatars.map((imgUrl, index) => (
              <Avatar key={index} $imgUrl={imgUrl || DefaultProfile}>
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