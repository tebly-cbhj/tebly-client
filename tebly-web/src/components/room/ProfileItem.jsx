import styled from 'styled-components';
import defaultProfile from '../../assets/icons/profile.svg';

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const Avatar = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
`;

const Name = styled.span`
  color: #525252;
  text-align: center;
  font-family: 'Pretendard Variable', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.02188rem;
`;

export default function ProfileItem({ name, src = defaultProfile, onClick }) {
  return (
    <Wrapper
      onClick={onClick}
      $clickable={!!onClick}
    >
      <Avatar src={src} alt={name} />
      <Name>{name}</Name>
    </Wrapper>
  );
}