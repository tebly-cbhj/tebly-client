import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Btn from './Btn';
import { useRoomStore } from '../../store/RoomStore';

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const PhotoArea = styled.div`
  height: 108px;
  align-self: stretch;
  background-color: ${(props) => props.theme.colors.primary50}; 
`;

const InfoArea = styled.div`
  display: flex;
  padding: 12px 20px 24px 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 11px;
  align-self: stretch;
  background: ${(props) => props.theme.colors.white}; 
`;

const ButtonWrapper = styled.div`
  width: 65px;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  height: 34px;
  margin: 0;
  color: ${(props) => props.theme.colors.gray900};
  ${(props) => props.theme.typography.h2} 
`;

const Description = styled.span`
  margin: 0;
  color: ${(props) => props.theme.colors.gray800};
  ${(props) => props.theme.typography.body2};
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
`;

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 33px;
  height: 33px;
  border-radius: 33px;
  background: ${(props) => props.theme.colors.gray300}; 
  
  position: relative;
  margin-left: ${(props) => (props.$isFirst ? '0' : '-12px')}; 
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

export default function RoomSummarySection({ roomId, avatars }) {
  const MAX_VISIBLE = 3; 
    const navigate = useNavigate();
  
  // store에서 방 정보를 찾아옵니다
  const room = useRoomStore((state) => 
    state.rooms.find((r) => String(r.id) === String(roomId))
  );

  const avatarList = avatars || (room?.members ? room.members.map(m => m.profileImage) : []);
  const visibleAvatars = avatarList.slice(0, MAX_VISIBLE);
  const extraCount = avatarList.length - MAX_VISIBLE;

  if (!room) {
    return <Container><p>방 정보를 찾을 수 없습니다.</p></Container>;
  }

  return (
    <Container>
      <PhotoArea />
      <InfoArea>
        <TextGroup>
          <Title>{room.title}</Title>
          <Description>{room.description}</Description>
        </TextGroup>

        <ActionRow>
          <AvatarGroup>
            {visibleAvatars.map((imgUrl, index) => (
              <Avatar 
                key={index} 
                $imgUrl={imgUrl} 
                $isFirst={index === 0} 
              >
                {index === visibleAvatars.length - 1 && extraCount > 0 && (
                  <ExtraCount>+{extraCount}</ExtraCount>
                )}
              </Avatar>
            ))}
          </AvatarGroup>
          
          <ButtonWrapper>
            <Btn 
              size="small" 
              onClick={() => navigate('/select-friend', { state: { roomId: roomId } })}
              text="친구 초대"
            />
          </ButtonWrapper>

        </ActionRow>
      </InfoArea>
    </Container>
  );
}