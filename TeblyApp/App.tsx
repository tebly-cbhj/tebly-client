import React, { useRef, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, BackHandler, ActivityIndicator, View, Text, Button } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { theme } from './src/theme';
import BottomNavBar from './src/components/BottomNavBar';
import SplashScreen from './src/components/SplashScreen';
import { ThemeProvider } from 'styled-components/native';

const WEB_URL = __DEV__
  ? 'http://172.30.1.82:5173/'
  : 'https://tebly.org';

// 구글이 웹뷰 안에서의 로그인을 막아서, 구글 로그인만 인앱 브라우저로 열어야 함
const OAUTH_REDIRECT_URL = 'https://tebly.org/login/callback';

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
  const [webViewSource, setWebViewSource] = useState(WEB_URL);
  const [showSplash, setShowSplash] = useState(true);

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

  function handleShouldStartLoad(request) {
    if (request.url.includes('/oauth2/authorization/google')) {
      InAppBrowser.openAuth(request.url, OAUTH_REDIRECT_URL, {
        showTitle: false,
        enableUrlBarHiding: true,
        enableDefaultShare: false,
      }).then((result) => {
        if (result.type === 'success' && result.url) {
          setWebViewSource(result.url);
        }
      });
      return false;
    }
    return true;
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
              source={{ uri: webViewSource }}
              style={{ flex: 1 }}
              onShouldStartLoadWithRequest={handleShouldStartLoad}
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

        {/* 3. 시작화면 (SafeAreaView 밖에서 화면 전체를 덮어야 해서 여기 위치, 웹뷰가 뒤에서 로딩되는 동안 앞에 표시) */}
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
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