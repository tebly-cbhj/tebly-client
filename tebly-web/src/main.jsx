import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // App 컴포넌트를 불러옵니다.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />  {/* 오직 App을 띄워주기만 합니다! */}
  </React.StrictMode>,
);