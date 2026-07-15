import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../api/client';
import { PageWrapper } from '../../PageWrapper';
import Searchfield from "../../components/common/Searchfield";
import FriendsSelect from "../../components/room/FriendsSelect";
import Badge from "../../components/common/Badge";
import Btn from "../../components/common/Btn";
import ConfirmPopup from "../../components/common/ConfirmPopup";
import { useFriendStore } from '../../store/FriendStore';
import Header from "../../components/common/Header";

// 같은 방에 이미 보낸(아직 수락 전인) 초대를 브라우저에 기억해서 중복 전송을 막는다.
// 서버가 방 멤버 목록에 응답 대기 중인 초대까지 내려주지 않아서, 프론트에서만 추적 가능.
function getSentInviteIds(roomId) {
  try {
    return JSON.parse(localStorage.getItem(`sentRoomInvites:${roomId}`)) || [];
  } catch {
    return [];
  }
}

function addSentInviteIds(roomId, ids) {
  if (!ids.length) return;
  const merged = Array.from(new Set([...getSentInviteIds(roomId), ...ids]));
  localStorage.setItem(`sentRoomInvites:${roomId}`, JSON.stringify(merged));
}


const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  flex: 1;
`;

const FriendsWrapper = styled.div`
  margin-top: 12px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SelectListContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  background-color: ${({ theme }) => theme.colors.bg};
  display: flex;
  flex-direction: column;
  padding: 12px 20px 34px 20px;
  box-sizing: border-box;
  max-width: 480px;
`;

const BadgeScrollArea = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  overflow-x: auto;
  flex-wrap: nowrap;  
  width: 100%;       
  min-width: 0;        
  flex-shrink: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const BtnWrapper = styled.div`
  margin-top: 22px;
  width: 350px;
  align-self: center;
`;

const SelectFriendPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState("");

  const appointmentMode = location.state?.appointmentMode ?? false;
  const currentRoomId = location.state?.roomId;
  const roomName = location.state?.roomName;
  const roomDescription = location.state?.description;
  const roomImageUrl = location.state?.imageUrl;
  // 방 멤버를 실제로 초대/추방하는 화면인지 (약속 참석자 선택과는 구분해야 함 —
  // 약속 참석자 선택은 이미 방에 있는 멤버 중 골라내는 것이라 "추방"이나 "중복 초대" 개념이 없음)
  const isRoomInviteFlow = !appointmentMode && !!currentRoomId;

  const friendsList = useFriendStore((state) => state.friends);
  const fetchFriends = useFriendStore((state) => state.fetchFriends);
  const myProfile = useFriendStore((state) => state.myProfile);
  const fetchMyProfile = useFriendStore((state) => state.fetchMyProfile);

  const [roomMembers, setRoomMembers] = useState([]);
  const [selected, setSelected] = useState(
    !appointmentMode && !currentRoomId ? (location.state?.selectedMembers ?? []) : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentInviteIds, setSentInviteIds] = useState([]);
  const [pendingRemoveFriend, setPendingRemoveFriend] = useState(null);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  useEffect(() => {
    if (appointmentMode && !myProfile) fetchMyProfile();
  }, [appointmentMode, myProfile, fetchMyProfile]);

  useEffect(() => {
    if (currentRoomId && (!appointmentMode || myProfile)) {
      apiClient.get(`/rooms/${currentRoomId}/members`).then((res) => {
        const filtered = appointmentMode
          ? res.data.filter((m) => m.userId !== myProfile.id)
          : res.data.filter((m) => m.role !== 'HOST');
        const members = filtered.map((m) => ({ id: m.userId, name: m.nickname, profileImage: m.profileImage }));
        setRoomMembers(members);
        setSelected(members);
      });
    }
  }, [currentRoomId, appointmentMode, myProfile]);

  useEffect(() => {
    if (isRoomInviteFlow) {
      setSentInviteIds(getSentInviteIds(currentRoomId));
    }
  }, [isRoomInviteFlow, currentRoomId]);

  const displayList = appointmentMode ? roomMembers : friendsList;

  const filteredList = displayList.filter((f) => f.name.includes(searchText));

  const isActive = selected.length > 0;

  const isExistingMember = (friendId) => roomMembers.some((m) => m.id === friendId);

  const handleToggle = (friend) => {
    const isSelected = !!selected.find((f) => f.id === friend.id);

    if (isRoomInviteFlow) {
      if (isSelected && isExistingMember(friend.id)) {
        // 이미 방에 있는 멤버를 체크 해제하는 건 곧 추방이라 확인을 받는다
        setPendingRemoveFriend(friend);
        return;
      }
      if (!isSelected && sentInviteIds.includes(friend.id)) {
        // 이미 초대를 보내 응답 대기 중인 친구는 다시 선택할 수 없음
        return;
      }
    }

    setSelected((prev) =>
      isSelected ? prev.filter((f) => f.id !== friend.id) : [...prev, friend]
    );
  };

  const handleRemove = (friendId) => {
    if (isRoomInviteFlow && isExistingMember(friendId)) {
      const friend = selected.find((f) => f.id === friendId);
      setPendingRemoveFriend(friend ?? { id: friendId, name: '이 친구' });
      return;
    }
    setSelected((prev) => prev.filter((f) => f.id !== friendId));
  };

  function confirmRemoveMember() {
    setSelected((prev) => prev.filter((f) => f.id !== pendingRemoveFriend.id));
    setPendingRemoveFriend(null);
  }

  function handleBack() {
    if (!appointmentMode && !currentRoomId) {
      // 새 방 만들기 흐름 — 입력값을 그대로 실어서 방 만들기 화면으로 복귀
      navigate('/create-room', {
        state: {
          name: roomName,
          description: roomDescription,
          imageUrl: roomImageUrl,
          selectedMembers: selected,
        },
      });
      return;
    }
    navigate(-1);
  }

  async function handleComplete() {
    if (isSubmitting) return;
    if (appointmentMode) {
      navigate('/create-appointment', {
        state: { ...location.state, selectedMembers: selected },
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentRoomId) {
        if (roomName) {
          await apiClient.patch(`/rooms/${currentRoomId}`, {
            name: roomName,
            description: roomDescription,
            imageUrl: roomImageUrl,
          });
        }

        const addedMembers = selected.filter((s) => !roomMembers.find((m) => m.id === s.id));
        const removedMembers = roomMembers.filter((m) => !selected.find((s) => s.id === m.id));

        if (addedMembers.length > 0) {
          await apiClient.post(`/rooms/${currentRoomId}/members`, {
            userIds: addedMembers.map((f) => f.id),
          });
          addSentInviteIds(currentRoomId, addedMembers.map((f) => f.id));
        }
        if (removedMembers.length > 0) {
          await apiClient.delete(`/rooms/${currentRoomId}/members`, {
            data: { userIds: removedMembers.map((f) => f.id) },
          });
        }

        navigate(-1);
      } else {
        await apiClient.post('/rooms', {
          name: roomName,
          description: roomDescription,
          imageUrl: roomImageUrl,
          memberIds: selected.map((f) => f.id),
        });
        navigate('/room-list');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageWrapper noNav>
      <Header
              title="친구 선택"
              leftIcon="back"
              onLeft={handleBack}
              icons={[]}
            />
      <ContentArea>
        <Searchfield
          placeholder="초대 할 친구 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <FriendsWrapper>
            {filteredList.map((friend) => (
                <FriendsSelect
                  key={friend.id}
                  friend={friend}
                  selected={!!selected.find((f) => f.id === friend.id)}
                  onToggle={() => handleToggle(friend)}
                  alreadyInvited={
                    isRoomInviteFlow &&
                    !isExistingMember(friend.id) &&
                    sentInviteIds.includes(friend.id)
                  }
                />
            ))}
        </FriendsWrapper>
      </ContentArea>

      <SelectListContainer>
        <BadgeScrollArea>
          {selected.map((friend) => (
            <Badge
                key={friend.id}
                text={friend.name}
                profileImg={friend.profileImage}
                onRemove={() => handleRemove(friend.id)}
            />
          ))}
        </BadgeScrollArea>
        <BtnWrapper>
          <Btn
            text="완료"
            disabled={!isActive || isSubmitting}
            onClick={handleComplete}
          />
        </BtnWrapper>
      </SelectListContainer>

      <ConfirmPopup
        visible={!!pendingRemoveFriend}
        title={`${pendingRemoveFriend?.name}님을\n방에서 추방할까요?`}
        confirmText="추방"
        danger
        onCancel={() => setPendingRemoveFriend(null)}
        onConfirm={confirmRemoveMember}
      />
    </PageWrapper>
  );
};

export default SelectFriendPage;