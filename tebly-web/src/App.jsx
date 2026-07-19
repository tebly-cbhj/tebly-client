import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './GlobalStyle';
import SplashScreen from './components/common/SplashScreen';
import RoomListPage from './Pages/Room/RoomListPage';
import CreateRoomPage from './Pages/Room/CreateRoomPage'; 
import SelectFriendPage from './Pages/Room/SelectFriendPage';
import RoomInfoPage from './Pages/Room/RoomInfoPage';
import TimeRecommendPage from './Pages/Room/TimeRecommendPage';
import Testpage from './Testpage';
import MyAppointMentPage from './Pages/Room/MyAppointMentPage';
import ChatPage from './Pages/Room/ChatPage';
import CreateAppointmentPage from './Pages/Room/CreateAppointmentPage';
import CalendarTestpage from './CalendarTestpage';
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
import LoginCallbackPage from './Pages/Onboarding/LoginCallbackPage';
import TermsAgreementPage from './Pages/Onboarding/TermsAgreementPage';
import ProfileSetupPage from './Pages/Onboarding/ProfileSetupPage';
import ScheduleRegisterPage from './Pages/Onboarding/ScheduleRegisterPage';
import InviteNotiPage from './Pages/Notification/InviteNotiPage';
import AlarmPage from './Pages/Notification/AlarmPage';
import BottomNavBar from './components/common/BottomNavBar';

function RootGate() {
  const accessToken = localStorage.getItem('accessToken');
  const onboardingDone = localStorage.getItem('onboardingDone');

  if (accessToken) return <CalendarPage />;
  if (!onboardingDone) return <Navigate to="/onboarding" replace />;
  return <Navigate to="/login" replace />;
}

function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    function handleMessage(event) {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'NAVIGATE') {
          navigate(data.path);
        }
      } catch (e) {
        // RN이 보낸 게 아닌 다른 메시지는 무시
      }
    }
    document.addEventListener('message', handleMessage);
    window.addEventListener('message', handleMessage);
    return () => {
      document.removeEventListener('message', handleMessage);
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate]);
  return (
    <>
      <Routes>
        <Route path="/room-list" element={<RoomListPage />} />
        <Route path="/create-room" element={<CreateRoomPage />} />
        <Route path="/select-friend" element={<SelectFriendPage />} />
        <Route path="/room/:roomId" element={<RoomInfoPage />} />
        <Route path="/room/:roomId/chat" element={<ChatPage />} />
        <Route path="/time-recommend" element={<TimeRecommendPage />} />
        <Route path="/test" element={<Testpage />} />
        <Route path="/my-appointments" element={<MyAppointMentPage />} />
        <Route path="/create-appointment" element={<CreateAppointmentPage />} />
        <Route path="/calendar-test" element={<CalendarTestpage />} />
        <Route path="/" element={<RootGate />} />
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
        <Route path='/login/callback' element={<LoginCallbackPage />} />
        <Route path='/signup/terms' element={<TermsAgreementPage />} />
        <Route path='/signup/profile' element={<ProfileSetupPage />} />
        <Route path='/signup/schedule' element={<ScheduleRegisterPage />} />
        <Route path='/noti-invitaion' element={<InviteNotiPage />} />
        <Route path='/alarm' element={<AlarmPage />} />
      </Routes>
      <BottomNavBar />
    </>
  );
}

export default function App() {
  // TeblyApp(RN)에선 이미 네이티브 스플래시가 웹뷰 위를 덮어주므로,
  // 웹 스플래시는 브라우저로 직접 접속했을 때만 보여준다(중복 방지).
  const isInApp = typeof window !== 'undefined' && window.ReactNativeWebView;
  const [showSplash, setShowSplash] = useState(!isInApp);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ThemeProvider>
  );
}
