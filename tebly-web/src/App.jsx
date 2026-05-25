// src/App.jsx
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme'; 
import TestPage from './TestPage'; 
import RoomListPage from './Pages/Room/RoomList'; 

export default function App() {
  // 스위치는 여기에 만듭니다!
  const [isTestPageOpen, setIsTestPageOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      {isTestPageOpen ? (
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsTestPageOpen(false)}
            style={{ position: 'absolute', top: 10, left: 10, zIndex: 999 }}
          >
            ⬅️ 돌아가기
          </button>
          
          <TestPage />
        </div>
      ) : (
        /* 기본 화면 */
        <div style={{ position: 'relative' }}>
          <RoomListPage />
          
          {/* 테스트 페이지로 가는 둥근 플로팅 버튼 예시 */}
          <button 
            onClick={() => setIsTestPageOpen(true)}
            style={{ 
              position: 'fixed', bottom: 30, right: 30, 
              padding: '15px', borderRadius: '50%', cursor: 'pointer' 
            }}
          >
            🚀
          </button>
        </div>
      )}
    </ThemeProvider>
  );
}