import styled from 'styled-components';
import BadgeXIcon from '../../assets/icons/close-s.svg';

// 뱃지 프레임
const BadgeWrapper = styled.div`
  display: inline-flex; // 이름 길이에 따라 가로 길이 변화
  padding: 8px;
  align-items: center;
  height: 36px;
  gap: 4px;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.white};
`;

// 프로필 사진
const ProfileCircle = styled.div`
  width: 20px;
  height: 20px;
  aspect-ratio: 1/1;

  border-radius: 20px;
  background: ${(props) => props.$img 
    ? `url(${props.$img}) center/cover no-repeat` 
    : props.theme.colors.gray500};
`;

// 사용자 이름
const BadgeText = styled.span`
  ${(props) => props.theme.typography.btn3}
`;

// 뱃지 내부 프레임 - 프로필 사진, 사용자 이름
const BadgeInner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 제거 버튼
const RemoveBtn = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
`;

export default function Badge({ text, profileImg, onRemove }) {
  return (
    <BadgeWrapper>
      <BadgeInner>
        <ProfileCircle $img={profileImg} />
        <BadgeText>{text}</BadgeText>
      </BadgeInner>
      <RemoveBtn onClick={onRemove}>
        <img src={BadgeXIcon} alt="remove" width={16} height={16} />
      </RemoveBtn>
    </BadgeWrapper>
  );
}