import styled from 'styled-components';
import RadioBtn from './RadioBtn'; // 만들어두신 라디오버튼

// 전체 한 줄 (아이템 하나)
const FriendItem = styled.div`
  display: flex;
  width: 350px;
  padding: 16px 4px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray300};

  &:last-child {
    border-bottom: none; 
  }
`;

// 왼쪽 컨테이너 (프사 + 이름 묶음)
const FriendInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

// 프로필 사진
const ProfileImage = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$hasImage ? 'transparent' : props.theme.colors.gray500};
  overflow: hidden;
  flex-shrink: 0;
`;

// 이름 텍스트
const FriendName = styled.span`
  ${(props) => props.theme.typography.S2}
  color: ${(props) => props.theme.colors.gray900};
`;

export default function FriendsSelect({ friend, selected, onToggle }) {
  return (
    <FriendItem>
      <FriendInfo>
        <ProfileImage $hasImage={!!friend.profileImage}>
          {friend.profileImage && (
            <img src={friend.profileImage} alt={friend.name} width="100%" height="100%" style={{ objectFit: 'cover' }} />
          )}
        </ProfileImage>
        <FriendName>{friend.name}</FriendName>
      </FriendInfo>

      <RadioBtn selected={selected} onToggle={onToggle} />
    </FriendItem>
  );
}