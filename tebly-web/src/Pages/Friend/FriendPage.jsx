import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useFriendStore } from '../../store/FriendStore';
import FriendListItemSwipe from '../../components/friend/FriendListItemSwipe';
import IconAddFriend from '../../components/friend/IconAddFriend';
import ConfirmPopup from '../../components/common/ConfirmPopup';

const Wrapper = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg};
  overflow-y: auto;
  box-sizing: border-box;
  padding-bottom: 88px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.bg};
  z-index: 10;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 3.3125rem;
  padding: 1.125rem 1.625rem 0.875rem 1.6875rem;
  justify-content: space-between;
  align-items: center;
  aspect-ratio: 390/53;
  box-sizing: border-box;
`;

const Title = styled.h1`
  display: flex;
  height: 32px;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
  color: #000;
  font-family: 'Pretendard Variable';
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.03125rem;
  margin: 0;
`;

const AddFriendBtn = styled.button`
  display: flex;
  width: 64px;
  height: 32px;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  width: calc(100% - 2.5rem);
  margin: 0 1.25rem;
  height: 3rem;
  padding: 0.75rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  background: #efefef;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const SearchIcon = styled.svg`
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-family: 'Pretendard Variable';
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.02188rem;
  color: #1a1a1a;

  &::placeholder {
    color: #a3a3a3;
  }
`;

const MyProfileContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0.75rem 1.25rem;
  align-items: center;
  gap: 1rem;
  box-sizing: border-box;
  flex-shrink: 0;
  margin-top: 0.5rem;
`;

const ProfileImage = styled.div`
  width: 3rem;
  height: 3rem;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  background: #dcdcdc;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
`;

const Name = styled.span`
  color: #1a1a1a;
  font-family: 'Pretendard Variable';
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.025rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Intro = styled.span`
  color: #525252;
  font-family: 'Pretendard Variable';
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.02188rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Divider = styled.div`
  width: calc(100% - 2.5rem);
  height: 0.0625rem;
  background: #dcdcdc;
  margin: 0 1.25rem;
  flex-shrink: 0;
`;

const FriendCountLabel = styled.div`
  display: flex;
  height: 2.5rem;
  padding: 0 1.25rem;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  flex-shrink: 0;
  color: #a3a3a3;
  font-family: 'Pretendard Variable';
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.02188rem;
`;

const FriendList = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function FriendPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const myProfile = useFriendStore((s) => s.myProfile);
  const fetchMyProfile = useFriendStore((s) => s.fetchMyProfile);
  const friends = useFriendStore((s) => s.friends);
  const fetchFriends = useFriendStore((s) => s.fetchFriends);
  const toggleFavorite = useFriendStore((s) => s.toggleFavorite);
  const deleteFriend = useFriendStore((s) => s.deleteFriend);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  function handleConfirmDelete() {
    const targetId = deleteTargetId;
    setDeleteTargetId(null);
    deleteFriend(targetId).catch(() => alert('친구 삭제에 실패했어요. 다시 시도해주세요.'));
  }

  useEffect(() => {
    fetchMyProfile();
    fetchFriends();
  }, [fetchMyProfile, fetchFriends]);

  const sorted = useMemo(
    () =>
      [...friends].sort((a, b) => {
        if (b.isFavorite !== a.isFavorite) return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
        return a.name.localeCompare(b.name, 'ko');
      }),
    [friends]
  );

  const filtered = useMemo(() => {
    const base = query.trim()
      ? sorted.filter(
          (f) => f.name.includes(query) || (f.intro && f.intro.includes(query))
        )
      : sorted;
    return base;
  }, [query, sorted]);

  return (
    <Wrapper>
      <StickyHeader>
        <Header>
          <Title>친구</Title>
          <AddFriendBtn aria-label="친구 추가" onClick={() => navigate('/friends/add')}>
            <IconAddFriend />
          </AddFriendBtn>
        </Header>

        <SearchBarWrapper>
        <SearchIcon
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="11" cy="11" r="7" stroke="#A3A3A3" strokeWidth="2" />
          <path d="M16.5 16.5L21 21" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" />
        </SearchIcon>
        <SearchInput
          placeholder="검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        </SearchBarWrapper>

        <FriendCountLabel>친구 {friends.length}명</FriendCountLabel>
      </StickyHeader>

      <MyProfileContainer>
        <ProfileImage>
          {myProfile?.profileImageUrl && <img src={myProfile.profileImageUrl} alt={myProfile.nickname} />}
        </ProfileImage>
        <TextArea>
          <Name>{myProfile?.nickname}</Name>
          {myProfile?.bio && <Intro>{myProfile.bio}</Intro>}
        </TextArea>
      </MyProfileContainer>

      <Divider />

      <FriendList>
        {filtered.map((friend) => (
          <FriendListItemSwipe
            key={friend.id}
            name={friend.name}
            intro={friend.intro}
            profileImage={friend.profileImage}
            isFavorite={friend.isFavorite}
            onToggleFavorite={() => toggleFavorite(friend.id)}
            onDelete={() => setDeleteTargetId(friend.id)}
            onClick={() => navigate(`/friends/${friend.id}`)}
          />
        ))}
      </FriendList>

      <ConfirmPopup
        visible={!!deleteTargetId}
        title="정말 삭제하시겠습니까?"
        confirmText="삭제"
        danger
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
      />
    </Wrapper>
  );
}