import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../theme';
import LogoPrimary from '../assets/logo/text-logo.svg';
import LogoWhite from '../assets/logo/text-logo-white.svg';

const ELLIPSE_SIZE = 40;
// 물결 굴곡 부분의 고정 높이(화면 크기와 무관하게 일정한 픽셀 값)
const WAVE_CREST_HEIGHT = 160;
// 물결 몸통(단색 사각형)이 화면 아래로 남기는 여유 높이
const WAVE_BOTTOM_BUFFER = 150;

const LOGO_WIDTH = 155;
const LOGO_HEIGHT = 60;

const ELLIPSE_DURATION = 1600;
const CROSSFADE_DURATION = 300;
const LOGO_HOLD_DURATION = 1000;
const WAVE_DURATION = 1400;
const LOGO_COLOR_CROSSFADE = 200;
const FINAL_HOLD_DURATION = 1000;

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const ELLIPSE_TARGET_SCALE =
    (Math.sqrt(SCREEN_W * SCREEN_W + SCREEN_H * SCREEN_H) / ELLIPSE_SIZE) * 1.3;
  // 물결 그룹 = [굴곡 부분] + [화면을 덮는 단색 사각형(여유 포함)], 이 순서로 세로로 쌓임
  const waveRectHeight = SCREEN_H + WAVE_BOTTOM_BUFFER;
  const waveGroupHeight = WAVE_CREST_HEIGHT + waveRectHeight;

  const ellipseScale = useRef(new Animated.Value(0)).current;
  const ellipseOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoWhiteOpacity = useRef(new Animated.Value(0)).current;
  const waveProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(ellipseScale, {
        toValue: 1,
        duration: ELLIPSE_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(ellipseOpacity, {
          toValue: 0,
          duration: CROSSFADE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: CROSSFADE_DURATION,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(LOGO_HOLD_DURATION),
      Animated.timing(waveProgress, {
        toValue: 1,
        duration: WAVE_DURATION,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: LOGO_COLOR_CROSSFADE,
          useNativeDriver: true,
        }),
        Animated.timing(logoWhiteOpacity, {
          toValue: 1,
          duration: LOGO_COLOR_CROSSFADE,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(FINAL_HOLD_DURATION),
    ]).start(() => {
      onFinish();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ellipseScaleInterpolated = ellipseScale.interpolate({
    inputRange: [0, 1],
    outputRange: [0.01, ELLIPSE_TARGET_SCALE],
  });

  // 시작: 그룹 전체가 화면 아래 숨어있음 / 끝: 굴곡 부분이 화면 위로 완전히 빠져나가고
  // 그 뒤를 단색 사각형이 이어받아 화면 전체가 순수 primary100이 됨
  const waveTranslateY = waveProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_H, -WAVE_CREST_HEIGHT],
  });

  return (
    <View style={styles.root}>
      {/* 1단계: primary100 타원이 커지며 화면을 덮음 */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ellipseWrapper,
          { opacity: ellipseOpacity },
        ]}
      >
        <Animated.View
          style={[
            styles.ellipse,
            { transform: [{ scale: ellipseScaleInterpolated }] },
          ]}
        />
      </Animated.View>

      {/* 2단계: primary100 물결이 아래에서 위로 올라오며 화면을 덮음 */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.waveWrapper,
          {
            width: SCREEN_W,
            height: waveGroupHeight,
            transform: [{ translateY: waveTranslateY }],
          },
        ]}
      >
        <Svg
          width={SCREEN_W}
          height={WAVE_CREST_HEIGHT}
          viewBox="0 0 400 160"
          preserveAspectRatio="none"
        >
          <Path
            d="M0,155 C24,155 48,50 72,50 C93,50 115,158 136,158 C160,158 184,15 208,15 C237,15 267,150 296,150 C331,150 365,0 400,0 L400,160 L0,160 Z"
            fill={theme.colors.primary100}
          />
        </Svg>
        <View style={{ width: SCREEN_W, height: waveRectHeight, backgroundColor: theme.colors.primary100 }} />
      </Animated.View>

      {/* 로고: 항상 화면 중앙, primary100 -> white 순서로 크로스페이드 */}
      <View pointerEvents="none" style={styles.logoWrapper}>
        <Animated.View style={[styles.logoLayer, { opacity: logoOpacity }]}>
          <LogoPrimary width={LOGO_WIDTH} height={LOGO_HEIGHT} />
        </Animated.View>
        <Animated.View style={[styles.logoLayer, { opacity: logoWhiteOpacity }]}>
          <LogoWhite width={LOGO_WIDTH} height={LOGO_HEIGHT} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.bg,
    overflow: 'hidden',
  },
  ellipseWrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ellipse: {
    width: ELLIPSE_SIZE,
    height: ELLIPSE_SIZE,
    borderRadius: ELLIPSE_SIZE / 2,
    backgroundColor: theme.colors.primary100,
  },
  waveWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  logoWrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLayer: {
    position: 'absolute',
  },
});
