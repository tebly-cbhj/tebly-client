import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoomListPage />} />
          <Route path="/create-room" element={<CreateRoomPage />} />
          <Route path="/select-friend" element={<SelectFriendPage />} />
          <Route path="/room/:roomId" element={<RoomInfoPage />} />
          <Route path="/time-recommend" element={<TimeRecommendPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/my-appointments" element={<MyAppointMentPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}