import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import LogoPrimary from '../../assets/logo/text-logo.svg?react';
import LogoWhite from '../../assets/logo/text-logo-white.svg?react';

// TeblyApp(RN)의 SplashScreen.tsx와 동일한 연출을 웹에서 재현한 버전.
// react-native-svg + Animated 대신 CSS transition으로 단계를 구현한다.
const ELLIPSE_SIZE = 40;
const WAVE_CREST_HEIGHT = 160;
const WAVE_BOTTOM_BUFFER = 150;

const LOGO_WIDTH = 155;
const LOGO_HEIGHT = 60;

const ELLIPSE_DURATION = 1600;
const CROSSFADE_DURATION = 300;
const LOGO_HOLD_DURATION = 1000;
const WAVE_DURATION = 1400;
const LOGO_COLOR_CROSSFADE = 200;
const FINAL_HOLD_DURATION = 1000;

const STAGE = {
  INIT: 0,
  ELLIPSE_GROW: 1,
  CROSSFADE_TO_LOGO: 2,
  WAVE_RISE: 3,
  LOGO_TO_WHITE: 4,
};

const Root = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.bg};
  overflow: hidden;
  z-index: 99999;
`;

const EllipseWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $opacity }) => $opacity};
  transition: opacity ${CROSSFADE_DURATION}ms linear;
  pointer-events: none;
`;

const Ellipse = styled.div`
  width: ${ELLIPSE_SIZE}px;
  height: ${ELLIPSE_SIZE}px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary100};
  transform: scale(${({ $scale }) => $scale});
  transition: transform ${ELLIPSE_DURATION}ms cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const WaveWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: translateY(${({ $translateY }) => $translateY}px);
  transition: transform ${WAVE_DURATION}ms cubic-bezier(0.455, 0.03, 0.515, 0.955);
  pointer-events: none;
`;

const WaveRect = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary100};
`;

const LogoWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const LogoLayer = styled.div`
  position: absolute;
  display: flex;
  opacity: ${({ $opacity }) => $opacity};
  transition: opacity ${({ $durationMs }) => $durationMs}ms linear;
`;

export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState(STAGE.INIT);
  const [dims] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));

  const ellipseTargetScale = (Math.sqrt(dims.w * dims.w + dims.h * dims.h) / ELLIPSE_SIZE) * 1.3;
  const waveRectHeight = dims.h + WAVE_BOTTOM_BUFFER;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setStage(STAGE.ELLIPSE_GROW));
    const timers = [
      setTimeout(() => setStage(STAGE.CROSSFADE_TO_LOGO), ELLIPSE_DURATION),
      setTimeout(
        () => setStage(STAGE.WAVE_RISE),
        ELLIPSE_DURATION + CROSSFADE_DURATION + LOGO_HOLD_DURATION
      ),
      setTimeout(
        () => setStage(STAGE.LOGO_TO_WHITE),
        ELLIPSE_DURATION + CROSSFADE_DURATION + LOGO_HOLD_DURATION + WAVE_DURATION
      ),
      setTimeout(
        () => onFinish?.(),
        ELLIPSE_DURATION +
          CROSSFADE_DURATION +
          LOGO_HOLD_DURATION +
          WAVE_DURATION +
          LOGO_COLOR_CROSSFADE +
          FINAL_HOLD_DURATION
      ),
    ];
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ellipseScale = stage >= STAGE.ELLIPSE_GROW ? ellipseTargetScale : 0.01;
  const ellipseOpacity = stage >= STAGE.CROSSFADE_TO_LOGO ? 0 : 1;
  const logoOpacity = stage >= STAGE.LOGO_TO_WHITE ? 0 : stage >= STAGE.CROSSFADE_TO_LOGO ? 1 : 0;
  const logoDuration = stage >= STAGE.LOGO_TO_WHITE ? LOGO_COLOR_CROSSFADE : CROSSFADE_DURATION;
  const logoWhiteOpacity = stage >= STAGE.LOGO_TO_WHITE ? 1 : 0;
  const waveTranslateY = stage >= STAGE.WAVE_RISE ? -WAVE_CREST_HEIGHT : dims.h;

  return (
    <Root>
      <EllipseWrapper $opacity={ellipseOpacity}>
        <Ellipse $scale={ellipseScale} />
      </EllipseWrapper>

      <WaveWrapper $translateY={waveTranslateY}>
        <svg
          width="100%"
          height={WAVE_CREST_HEIGHT}
          viewBox="0 0 400 160"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <path
            d="M0,155 C24,155 48,50 72,50 C93,50 115,158 136,158 C160,158 184,15 208,15 C237,15 267,150 296,150 C331,150 365,0 400,0 L400,160 L0,160 Z"
            fill={theme.colors.primary100}
          />
        </svg>
        <WaveRect style={{ height: waveRectHeight }} />
      </WaveWrapper>

      <LogoWrapper>
        <LogoLayer $opacity={logoOpacity} $durationMs={logoDuration}>
          <LogoPrimary width={LOGO_WIDTH} height={LOGO_HEIGHT} />
        </LogoLayer>
        <LogoLayer $opacity={logoWhiteOpacity} $durationMs={LOGO_COLOR_CROSSFADE}>
          <LogoWhite width={LOGO_WIDTH} height={LOGO_HEIGHT} />
        </LogoLayer>
      </LogoWrapper>
    </Root>
  );
}
