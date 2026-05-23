import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './GlobalStyle';
import Btn from './components/common/Btn'; 
import Toggle from './components/common/Toggle'; 
import RadioBtn from './components/common/RadioBtn';
import Badge from './components/common/Badge';
import SearchField from './components/common/Searchfield';
import DateField from './components/common/DateField';
import Chip from './components/common/Chip';
import TabBtn from './components/common/TabBtn';
//import Calendar from './components/common/Calendar';
import RoomListCard from './components/common/RoomListCard';
//import AddBtn from './components/common/AddBtn';

export default function Testpage() {
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [badges, setBadges] = useState(['테이브', '캘박하조조조']);
  const [currentTab, setCurrentTab] = useState('tab1'); // 탭 확인용

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

            {/* 입력 필드 */}
            <div>
                <h3> 검색 필드 </h3>
                <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <SearchField />
                    <DateField />
                </div>
            </div>
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
    </ThemeProvider>
  );
}
