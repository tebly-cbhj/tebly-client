import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import RoomListPage from './Pages/Room/RoomListPage';
import CreateRoomPage from './Pages/Room/CreateRoomPage'; 
import SelectFriendPage from './Pages/Room/SelectFriendPage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoomListPage />} />
          <Route path="/create-room" element={<CreateRoomPage />} />
          <Route path="/select-friend" element={<SelectFriendPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}