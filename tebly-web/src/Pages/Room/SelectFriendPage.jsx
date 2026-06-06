import { useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoomStore } from '../../store/RoomStore';
import { PageWrapper } from '../../PageWrapper';
import SearchField from "../../components/common/SearchField";
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

// SearchField ~ FriendsSelect 간격
const FriendsWrapper = styled.div`
  margin-top: 12px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// 하단 고정 컨테이너
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
  padding: 12px 20px 34px 20px;  /* 하단 34px */
  box-sizing: border-box;
  max-width: 480px;
`;

// 뱃지 가로 스크롤
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
  const addRoom = useRoomStore((state) => state.addRoom);
  const updateRoomMembers = useRoomStore((state) => state.updateRoomMembers);
  const [searchText, setSearchText] = useState("");

  const friendsList = useFriendStore((state) => state.friends);  
  const filteredFriends = friendsList.filter((friend) =>         
    friend.name.includes(searchText)
  );

  const currentRoomId = location.state?.roomId;
  const existingRoom = useRoomStore((state) => 
    state.rooms.find((r) => r.id === currentRoomId)
  );

  const [selected, setSelected] = useState(existingRoom ? existingRoom.members : []); 
  const isActive = selected.length > 0;

  // 체크박스 토글 함수
  const handleToggle = (friend) => {
    setSelected((prev) =>
      prev.find((f) => f.id === friend.id)
        ? prev.filter((f) => f.id !== friend.id) // 이미 선택됐으면 제거
        : [...prev, friend]                      // 없으면 추가
    );
  };

  // 뱃지 X 버튼 삭제 함수
  const handleRemove = (friendId) => {
    setSelected((prev) => prev.filter((f) => f.id !== friendId));
  };

  return (
    <PageWrapper>
      <Header 
              title="친구 선택"
              leftIcon="back"
              onLeft={() => navigate(-1)}
              icons={[]}
            />
      <ContentArea>
        <SearchField
          placeholder="초대 할 친구 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <FriendsWrapper>
            {filteredFriends.map((friend) => (
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
            onClick={() => {
                if (currentRoomId) {
                  // 기존 방 번호가 있다면 업데이트 함수 실행
                  updateRoomMembers(currentRoomId, selected);
                  navigate(-1);
                } else {
                  // 방 번호가 없다면 (방 생성 과정) 새 방 만들기 함수 실행
                  const { roomName, description } = location.state || {};
                  addRoom(roomName, description, selected); 
                  navigate('/');
                }
            }}
          />
        </BtnWrapper>
      </SelectListContainer>
    </PageWrapper>
  );
};

export default SelectFriendPage;