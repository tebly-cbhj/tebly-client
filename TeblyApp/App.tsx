import React, { useRef, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, BackHandler, ActivityIndicator, View, Text, Button } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { theme } from './src/theme';
import BottomNavBar from './src/components/BottomNavBar';
import { ThemeProvider } from 'styled-components/native';

const WEB_URL = __DEV__
  ? 'http://10.15.51.173:5173/'
  : 'https://tebly-client.vercel.app';

const NAVBAR_VISIBLE_PATHS = ['/', '/room-list', '/calendar/event-detail', '/more', '/friends'];

function getPathname(url) {
  const match = url.match(/^https?:\/\/[^/]+(\/[^?#]*)?/);
  return (match && match[1]) || '/';
}

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });

    return () => handler.remove();
  }, [canGoBack]);

  function navigateWebView(path) {
    webViewRef.current?.postMessage(JSON.stringify({ type: 'NAVIGATE', path }));
  }

  return (
    // 💡 하단 바에서 theme.colors를 꺼내 쓸 수 있도록 전체를 감싸줍니다!
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />

          {hasError ? (
            <View style={styles.center}>
              <Text>페이지를 불러올 수 없어요.</Text>
              <Button
                title="다시 시도"
                onPress={() => setHasError(false)}
              />
            </View>
          ) : (
            <WebView
              ref={webViewRef}
              source={{ uri: WEB_URL }}
              style={{ flex: 1 }}
              onNavigationStateChange={(navState) => {
                setCanGoBack(navState.canGoBack);
                setCurrentPath(getPathname(navState.url));
              }}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.center}>
                  <ActivityIndicator size="large" />
                </View>
              )}
              onError={() => setHasError(true)}
            />
          )}

          {/* 2. 껍데기 (하단 탭바) */}
          {NAVBAR_VISIBLE_PATHS.includes(currentPath) && (
            <BottomNavBar onTabPress={navigateWebView} currentPath={currentPath} />
          )}
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});