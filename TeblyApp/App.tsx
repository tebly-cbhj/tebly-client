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
        
        <WebView
          source={{ uri: 'http://172.20.120.48:5173/' }} 
          style={{ flex: 1 }}
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
});