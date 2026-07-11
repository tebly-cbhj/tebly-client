import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../api/client';
import { PageWrapper } from '../../PageWrapper';
import Searchfield from "../../components/common/Searchfield";
import FriendsSelect from "../../components/room/FriendsSelect";
import Badge from "../../components/common/Badge";
import Btn from "../../components/common/Btn";
import { useFriendStore } from '../../store/FriendStore';
import Header from "../../components/common/Header";


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

  const friendsList = useFriendStore((state) => state.friends);
  const fetchFriends = useFriendStore((state) => state.fetchFriends);

  const [roomMembers, setRoomMembers] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  useEffect(() => {
    if (currentRoomId) {
      apiClient.get(`/rooms/${currentRoomId}/members`).then((res) => {
        const members = res.data.map((m) => ({ id: m.userId, name: m.nickname, profileImage: m.profileImage }));
        setRoomMembers(members);
        setSelected(members);
      });
    }
  }, [currentRoomId]);

  const displayList = appointmentMode ? roomMembers : friendsList;

  const filteredList = displayList.filter((f) => f.name.includes(searchText));

  const isActive = selected.length > 0;

  const handleToggle = (friend) => {
    setSelected((prev) =>
      prev.find((f) => f.id === friend.id)
        ? prev.filter((f) => f.id !== friend.id)
        : [...prev, friend]
    );
  };

  const handleRemove = (friendId) => {
    setSelected((prev) => prev.filter((f) => f.id !== friendId));
  };

  async function handleComplete() {
    if (appointmentMode) {
      navigate('/create-appointment', {
        state: { roomId: currentRoomId, selectedMembers: selected },
      });
    } else if (currentRoomId) {
      if (roomName) {
        await apiClient.patch(`/rooms/${currentRoomId}`, {
          name: roomName,
          description: roomDescription,
        });
      }

      const addedMembers = selected.filter((s) => !roomMembers.find((m) => m.id === s.id));
      const removedMembers = roomMembers.filter((m) => !selected.find((s) => s.id === m.id));

      if (addedMembers.length > 0) {
        await apiClient.post(`/rooms/${currentRoomId}/members`, {
          userIds: addedMembers.map((f) => f.id),
        });
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
        memberIds: selected.map((f) => f.id),
      });
      navigate('/room-list');
    }
  }

  return (
    <PageWrapper noNav>
      <Header
              title="친구 선택"
              leftIcon="back"
              onLeft={() => navigate(-1)}
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
            disabled={!isActive}
            onClick={handleComplete}
          />
        </BtnWrapper>
      </SelectListContainer>
    </PageWrapper>
  );
};

export default SelectFriendPage;