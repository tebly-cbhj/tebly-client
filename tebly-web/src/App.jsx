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
import OCRResultPage from './Pages/Calendar/OCRResultPage';
import OCREditPage from './Pages/Calendar/OCREditPage';
import MorePage from './Pages/More/MorePage';
import EditProfilePage from './Pages/More/EditProfilePage';
import AlarmSettingPage from './Pages/More/AlarmSettingPage'
import CategorySettingPage from './Pages/More/CategorySettingPage'
import FriendPage from './Pages/Friend/FriendPage';
import FriendCalendarPage from './Pages/Friend/FriendCalendarPage';
import AddFriendPage from './Pages/Friend/AddFriendPage';
import OnboardingPage from './Pages/Onboarding/OnboardingPage';
import LoginPage from './Pages/Onboarding/LoginPage';
import TermsAgreementPage from './Pages/Onboarding/TermsAgreementPage';
import ProfileSetupPage from './Pages/Onboarding/ProfileSetupPage';
import LocationConsentPage from './Pages/Onboarding/LocationConsentPage';
import ScheduleRegisterPage from './Pages/Onboarding/ScheduleRegisterPage';
import InviteNotiPage from './Pages/Notification/InviteNotiPage';
import AlarmPage from './Pages/Notification/AlarmPage';

function Layout() {
  const location = useLocation();
  
  const showNavBar = ['/', '/room-list', '/calendar/event-detail', '/more', '/friends'].includes(location.pathname);
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
        <Route path="/ocr-edit" element={<OCREditPage />} />
        <Route path="/calendar/event-detail" element={<EventDetailPage />} />
        <Route path="/calendar/create" element={<CreateSchedulePage />} />
        <Route path='/more' element={<MorePage />} />
        <Route path='/edit-profile' element={<EditProfilePage />} />
        <Route path='/alarm-setting' element={<AlarmSettingPage />} />
        <Route path='/category-setting' element={<CategorySettingPage />} />
        <Route path="/friends" element={<FriendPage />} />
        <Route path="/friends/add" element={<AddFriendPage />} />
        <Route path="/friends/:friendId" element={<FriendCalendarPage />} />
        <Route path='/onboarding' element={<OnboardingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup/terms' element={<TermsAgreementPage />} />
        <Route path='/signup/profile' element={<ProfileSetupPage />} />
        <Route path='/signup/location' element={<LocationConsentPage />} />
        <Route path='/signup/schedule' element={<ScheduleRegisterPage />} />
        <Route path='/noti-invitaion' element={<InviteNotiPage />} />
        <Route path='/alarm' element={<AlarmPage />} />
      </Routes>
      {showNavBar && <BottomNavBar />}  {/* 지정된 페이지에서만 표시 */}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ThemeProvider>
  );
}