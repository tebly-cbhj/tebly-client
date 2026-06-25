import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './GlobalStyle';
import RoomListPage from './Pages/Room/RoomListPage';
import CreateRoomPage from './Pages/Room/CreateRoomPage'; 
import SelectFriendPage from './Pages/Room/SelectFriendPage';
import RoomInfoPage from './Pages/Room/RoomInfoPage';
import TimeRecommendPage from './Pages/Room/TimeRecommendPage';
import TestPage from './TestPage';
import MyAppointMentPage from './Pages/Room/MyAppointMentPage';
import ChatPage from './Pages/Room/ChatPage';
import CreateAppointmentPage from './Pages/Room/CreateAppointmentPage';
import CalendarTestpage from './CalendarTestpage';
import BottomNavBar from './components/common/BottomNavBar';
import EventDetailPage from './Pages/Calendar/EventDetailPage';
import CreateSchedulePage from './Pages/Calendar/CreateSchedulePage';
import CalendarPage from './Pages/Calendar/CalendarPage';
import OCRLoadingPage from './Pages/Calendar/OCRLoadingPage';
import OCRResultPage from './Pages/Calendar/OCRResultPage'
import MorePage from './Pages/More/MorePage'

function Layout() {
  const location = useLocation();
  const hideNavBar = location.pathname.includes('/chat'); // /chat 포함된 경로면 숨김

  return (
    <>
      <Routes>
        <Route path="/room-list" element={<RoomListPage />} />
        <Route path="/create-room" element={<CreateRoomPage />} />
        <Route path="/select-friend" element={<SelectFriendPage />} />
        <Route path="/room/:roomId" element={<RoomInfoPage />} />
        <Route path="/room/:roomId/chat" element={<ChatPage />} />
        <Route path="/time-recommend" element={<TimeRecommendPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/my-appointments" element={<MyAppointMentPage />} />
        <Route path="/create-appointment" element={<CreateAppointmentPage />} />
        <Route path="/calendar-test" element={<CalendarTestpage />} />
        <Route path="/" element={<CalendarPage />} />
        <Route path="/ocr-loading" element={<OCRLoadingPage />} />
        <Route path="/ocr-result" element={<OCRResultPage />} />
        <Route path="/calendar/event-detail" element={<EventDetailPage />} />
        <Route path="/calendar/create" element={<CreateSchedulePage />} />
        <Route path='/more' element={<MorePage />} />
      </Routes>
      {!hideNavBar && <BottomNavBar />}  {/* 채팅 페이지면 숨김 */}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Layout />  {/* Routes랑 BottomNavBar를 Layout으로 감쌈 */}
      </BrowserRouter>
    </ThemeProvider>
  );
}