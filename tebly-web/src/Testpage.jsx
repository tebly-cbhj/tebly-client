import { useState, useRef, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './GlobalStyle';
import Btn from './components/common/Btn'; 
import Toggle from './components/common/Toggle'; 
import RadioBtn from './components/common/RadioBtn';
import Badge from './components/common/Badge';
import SearchField from './components/common/Searchfield';
import DateField from './components/common/DateField';
import DatePicker from './components/room/DatePicker';
import Chip from './components/common/Chip';
import ChipFilter from './components/room/ChipFilter';
import ChipScheduleOption from './components/room/ChipScheduleOption';
import TabBtn from './components/common/TabBtn';
//import Calendar from './components/common/Calendar';
import RoomListCard from './components/common/RoomListCard';
//import AddBtn from './components/common/AddBtn';
import ActionSheet from './components/common/ActionSheet';
import RoomCover from './components/common/RoomCover';
import FriendsSelect from './components/common/FriendsSelect';
import SelectRow from './components/room/SelectRow';
import TimeOptionCard from './components/room/TimeOptionCard';
import OptionItem from './components/room/OptionItem';
import MessageBubble from './components/room/MessageBubble';
import ProfileItem from './components/room/ProfileItem';

export default function Testpage() {
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [badges, setBadges] = useState(['테이브', '캘박하조조조']);
  const [currentTab, setCurrentTab] = useState('tab1'); // 탭 확인용
  const [isSheetVisible, setIsSheetVisible] = useState(false)
  const [selectedId, setSelectedId] = useState(null); // 친구 선택 확인용
  const [coverImage, setCoverImage] = useState(null); // 커버 이미지 확인용
  const [selectRowText, setSelectRowText] = useState('');
  const [selectRowOpen, setSelectRowOpen] = useState(false);
  const [selectedTimeOption, setSelectedTimeOption] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  const dateRangeText = dateRange
    ? `${dateRange.start.month}.${dateRange.start.day}-${dateRange.end.month}.${dateRange.end.day}`
    : '날짜 미선택';
  const selectRowInputRef = useRef(null);


  const dummyRooms = [
    {
      id: 1,
      title: '캘박하조',
      description: '테이브 연합 프로젝트 팀',
      avatars: [null, null, null], 
    },
    {
      id: 2,
      title: '회의하조',
      description: '매주 토요일 사당에서',
      avatars: [null, null], // 아바타 2개 겹침
    }
  ];

  const DummyFriends = [
    { id: 1, name: '테이브', profileImage: null },
    { id: 2, name: '캘박하조', profileImage: null },
    { id: 3, name: '연합 프로젝트', profileImage: null },
    ];

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <h2>디자인 시스템 테스트 페이지</h2>

            <h3>버튼</h3>
            {/* 버튼 */}
            <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3>L</h3>
                    <Btn text="확인" />
                    <Btn text="확인" disabled={true} />
                </div>

                <div style={{ width: '249px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3>M</h3>
                    <Btn text="확인" />
                    <Btn text="확인" disabled={true} />
                </div>

                <div style={{ width: '109px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3>S</h3>
                    <Btn text="확인" />
                    <Btn text="확인" disabled={true} />
                </div>

                <div style={{ width: '45px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3>small</h3>
                    <Btn text="확인" size="small" />
                    <Btn text="확인" disabled={true} size="small" />
                </div>
            </div>
        </div>

        <div style={{ padding: '40px', display: 'flex', gap: '30px' }}>
            {/* 토글 */}
            <div>
                <h3> 토글 </h3>
                    <Toggle 
                        isOn={isToggleOn} 
                        onToggle={() => setIsToggleOn(!isToggleOn)} 
                    />
            </div>

            {/* 라디오 버튼 */}
            <div>
                <h3> 라디오 버튼 </h3>
                <RadioBtn 
                    selected={isOn} 
                    onToggle={() => setIsOn(!isOn)}
                />
            </div>

            {/* 배지 */}
            <div>
                <h3> 배지 </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {badges.map((name) => (
                    <Badge
                        key={name}
                        text={name}
                        profileImg={null}
                        onRemove={() => setBadges(badges.filter((b) => b !== name))}
                    />
                    ))}
                </div>
            </div>

            {/* 칩 */}
            <div>
                <h3> 칩 </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Chip text="월간" />
                    <Chip text="주간" />
                </div>
            </div>

            {/* 칩 필터 */}
            <div>
                <h3> 칩 필터 </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <ChipFilter text="텍스트" />
                </div>
            </div>

            {/* 칩 스케줄 옵션 */}
            <div>
                <h3> 칩 스케줄 옵션 </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <ChipScheduleOption text={dateRangeText} />
                </div>
            </div>


            {/* 입력 필드 */}
            <div>
                <h3> 검색 필드 </h3>
                <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <SearchField />
                    <DateField />
                </div>
            </div>
        </div>
        <div style={{ padding: '40px 40px 0' }}>
            <h3> 방-일정선택 </h3>
            <DatePicker onChange={setDateRange} />
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
            {/* 탭 버튼 */}
            <div style={{width: '332px'}}>
                <h3> 탭 버튼 </h3>
                <TabBtn activeTab={currentTab} onTabClick={setCurrentTab} />
            </div>

            {/* 달력
            <div>
                <h3> 달력 </h3>
                <Calendar />
            </div>*/}
        

            {/* 방 카드 */}
            <div>
                <h3> 방 카드 </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {dummyRooms.map((room) => (
                        <RoomListCard
                            key={room.id}
                            title={room.title}
                            description={room.description}
                            avatars={room.avatars}
                        />
                    ))}
                </div>
            </div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
            {/* 액션 시트 */}
            <div>
                <h3> 액션 시트 </h3>
                <button onClick={() => setIsSheetVisible(true)}>
                    액션 시트 열기
                </button>
                <ActionSheet 
                    visible={isSheetVisible} 
                    onClose={() => setIsSheetVisible(false)} 
                    onOption1={() => console.log('첫 번째 버튼 클릭됨!')}
                    onOption2={() => console.log('두 번째 버튼 클릭됨!')}
                />
            </div>
            {/* 커버 이미지 업로드 */} 
            <div>
                <h3> 커버 이미지 업로드 </h3>
                <RoomCover
                    imageUrl={coverImage}
                    onClick={() => { /* 갤러리 열기 */ }}
                />
            </div>

            {/* 친구 선택 */}
            <div>
                <h3> 친구 선택 </h3>
                {DummyFriends.map((friend) => (
                    <FriendsSelect
                    key={friend.id}
                    friend={friend}
                    selected={selectedId === friend.id}
                    onToggle={() => setSelectedId(friend.id)}
                    />
            ))}
            </div>
        </div>
        <div>
            <h3>셀렉트 로우</h3>
            <div style={{ width: '350px', backgroundColor: '#EFEFEF', padding: '0 20px', boxSizing: 'border-box' }}>
                <div style={{ position: 'relative' }}>
                    <SelectRow
                        left_icon={true}
                        right_icon={true}
                        text_empty="텍스트를 입력하세요"
                        text_selected={selectRowText}
                        text_typing={selectRowText}
                        state={selectRowOpen ? 'typing' : selectRowText === '' ? 'empty' : 'selected'}
                        onClick={() => {
                            setSelectRowOpen(true);
                            setTimeout(() => selectRowInputRef.current?.focus(), 0);
                        }}
                    />
                    {selectRowOpen && (
                        <input
                            ref={selectRowInputRef}
                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'text', width: '100%' }}
                            value={selectRowText}
                            onChange={(e) => setSelectRowText(e.target.value)}
                            onBlur={() => setSelectRowOpen(false)}
                        />
                    )}
                </div>
            </div>
        </div>
        <div>
            <h3>프로필 아이템</h3>
            <div style={{ display: 'flex', gap: '16px' }}>
                <ProfileItem name="테이브" />
                <ProfileItem name="캘박하조" />
                <ProfileItem name="연합 프로젝트" />
            </div>
        </div>
        <div style={{ padding: '40px 40px 0' }}>
            <h3>시간대 추천 선택</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <TimeOptionCard date={22} dayOfWeek="금요일" timeRange="11:00~13:00" memberCount={4} totalCount={6} selected={selectedTimeOption === 0} onClick={() => setSelectedTimeOption(0)} />
                <TimeOptionCard date={23} dayOfWeek="토요일" timeRange="14:00~16:00" memberCount={2} totalCount={6} selected={selectedTimeOption === 1} onClick={() => setSelectedTimeOption(1)} />
            </div>
        </div>
        <div style={{ padding: '40px 40px 0' }}>
            <h3>옵션 아이템</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <OptionItem text="옵션 1" selected={selectedOption === 0} onClick={() => setSelectedOption(0)} />
                <OptionItem text="옵션 2" selected={selectedOption === 1} onClick={() => setSelectedOption(1)} />
                <OptionItem text="옵션 3" selected={selectedOption === 2} onClick={() => setSelectedOption(2)} />
            </div>
        </div>
        <div style={{ padding: '40px 40px 0' }}>
            <h3>메시지 버블</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '350px', background: '#F6F6F6', padding: '16px', boxSizing: 'border-box' }}>
                <MessageBubble type="received-shown" senderName="테이브" text="안녕하세요! 일정 확인해주세요." profileImage={null} />
                <MessageBubble type="received-hidden" text="내일 오후 2시에 만나요." />
                <MessageBubble type="sent" text="넵 확인했습니다!" />
            </div>
        </div>
    </ThemeProvider>

  );
}