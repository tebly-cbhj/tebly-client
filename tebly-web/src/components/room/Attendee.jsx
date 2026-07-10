import styled from 'styled-components';
import basicProfile from '../../assets/default/profile/basic.svg';

const AttendeeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  filter: ${({ $available }) => ($available ? 'none' : 'grayscale(100%)')};
`;

const Name = styled.span`
  ${({ theme }) => theme.typography.btn1};
  color: ${({ theme }) => theme.colors.gray900};
`;

export default function Attendee({ name, profileImage, available = true }) {
  let imageSrc;
  if (profileImage) {
    imageSrc = profileImage;
  } else {
    imageSrc = basicProfile;
  }

  return (
    <AttendeeWrapper>
      <ProfileImage src={imageSrc} alt={name} $available={available} />
      <Name>{name}</Name>
    </AttendeeWrapper>
  );
}