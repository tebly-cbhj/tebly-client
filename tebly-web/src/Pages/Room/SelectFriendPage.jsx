import { useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoomStore } from '../../store/RoomStore';
import { PageWrapper } from '../../PageWrapper';
import SearchField from "../../components/common/SearchField";
import FriendsSelect from "../../components/common/FriendsSelect";
import Badge from "../../components/common/Badge";
import Btn from "../../components/common/Btn";

// 헤더 아래 16px
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
  flex-wrap: nowrap;   /* 추가 - 줄바꿈 방지 */
  width: 100%;         /* 추가 */
  min-width: 0;        /* 추가 */
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

// 임시 데이터
const TEMP_FRIENDS = [
  { id: 1, name: '김돌리', profileImage: null },
  { id: 2, name: '최또치', profileImage: null },
  { id: 3, name: '고길동', profileImage: null },
  { id: 4, name: '희동이', profileImage: null },
  { id: 5, name: '마이쿨', profileImage: null },
];

const SelectFriendPage = () => {
  const [selected, setSelected] = useState([]); // 선택된 친구 목록

  const isActive = selected.length > 0;

  const handleToggle = (friend) => {
    setSelected((prev) =>
      prev.find((f) => f.id === friend.id)
        ? prev.filter((f) => f.id !== friend.id) // 이미 선택됐으면 제거
        : [...prev, friend]                       // 없으면 추가
    );
  };

  const handleRemove = (friendId) => {
    setSelected((prev) => prev.filter((f) => f.id !== friendId));
  };

  const navigate = useNavigate();
  const location = useLocation();
  const addRoom = useRoomStore((state) => state.addRoom);

  return (
    <PageWrapper>
      <ContentArea>
        <SearchField placeholder="초대 할 친구 검색" />
        <FriendsWrapper>
            {TEMP_FRIENDS.map((friend) => (
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
                const { roomName, description } = location.state;
                addRoom(roomName, description, selected.map((f) => f.profileImage)); // 추가
                navigate('/');
            }}
            />
        </BtnWrapper>
      </SelectListContainer>
    </PageWrapper>
  );
};

export default SelectFriendPage;