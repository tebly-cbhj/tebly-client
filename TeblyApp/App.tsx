import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { theme } from './src/theme';
import BottomNavBar from './src/components/BottomNavBar';
import { ThemeProvider } from 'styled-components/native';

export default function App() {
  return (
    // 💡 하단 바에서 theme.colors를 꺼내 쓸 수 있도록 전체를 감싸줍니다!
    <ThemeProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* 1. 알맹이 (리액트 웹뷰) */}
        <WebView
          source={{ uri: 'http://172.20.120.48:5173/' }} 
          style={styles.webview}  {/* ← 변경 */}
        />

        {/* 2. 껍데기 (하단 탭바) */}
        <BottomNavBar />
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
   webview: {
    flex: 1,
    width: '100%',    {/* ← 추가 */}
    backgroundColor: theme.colors.bg,  {/* ← 추가: 웹 로딩 전 빈 공간도 bg색으로 */}
  },
});