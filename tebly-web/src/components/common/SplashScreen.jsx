import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import LogoPrimary from '../../assets/logo/text-logo.svg?react';
import LogoWhite from '../../assets/logo/text-logo-white.svg?react';

// TeblyApp(RN)의 SplashScreen.tsx와 동일한 연출을 웹에서 재현한 버전.
// react-native-svg + Animated 대신 CSS transition으로 단계를 구현한다.
const ELLIPSE_SIZE = 40;
// 물결 굴곡의 높이를 고정 픽셀값으로 두면, 화면 폭이 좁아질 때 가로로만 눌려서
// 봉우리들이 다닥다닥 뭉쳐 보인다(고정 세로 높이 대비 가로 폭만 줄어드는 왜곡).
// 그래서 폭 기준으로 비례하도록 계산한다 — 390px 폭 기준으로 240px 높이가 되도록 디자인된
// 비율을 유지하고, 앱 전체가 데스크탑에서도 폰 폭(480px)로 제한하는 것과 동일하게 상한을 둔다.
const WAVE_DESIGN_WIDTH = 390;
const WAVE_DESIGN_CREST_HEIGHT = 850;
const WAVE_MAX_EFFECTIVE_WIDTH = 480;
// 대기 상태에서 화면 아래로 완전히 숨겨둘 때, 실제 화면 높이 측정이 살짝 작게 잡히는
// 환경(모바일 브라우저 주소창 등)에서도 확실히 안 보이도록 여유를 더 둔다.
const WAVE_HIDE_EXTRA_MARGIN = 200;
// 오른쪽 아래에서 대각선으로 스윽 올라오는 느낌을 주기 위해, 회전을 고정해두고
// translateY만 애니메이션하면 이동 경로 자체가 그 각도만큼 기운 대각선이 된다.
const WAVE_ROTATION_DEG = -18;

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
  position: fixed;
  top: 50%;
  left: 50%;
  width: ${({ $size }) => $size}px;
  margin-left: ${({ $size }) => -$size / 2}px;
  margin-top: ${({ $size }) => -$size / 2}px;
  transform-origin: center center;
  transform: rotate(${WAVE_ROTATION_DEG}deg) translateY(${({ $translateY }) => $translateY}px);
  /* 서서히 시작해서 점점 빨라지는(가속) 느낌으로 - easeInCubic 계열 */
  transition: transform ${WAVE_DURATION}ms cubic-bezier(0.55, 0.055, 0.675, 0.19);
  pointer-events: none;
`;

const WaveRect = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary100};
  /* svg가 인라인 요소라 밑에 미세한 틈이 생길 수 있어서, 살짝 겹쳐서 틈을 없앤다 */
  margin-top: -2px;
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
  const waveEffectiveWidth = Math.min(dims.w, WAVE_MAX_EFFECTIVE_WIDTH);
  const waveCrestHeight = Math.round(
    waveEffectiveWidth * (WAVE_DESIGN_CREST_HEIGHT / WAVE_DESIGN_WIDTH)
  );
  // 대각선으로 기울어진 채 움직여도 화면 네 귀퉁이가 안 비게, 화면보다 훨씬 큰
  // 정사각형을 만들어서 회전시킨다(가운데 정렬해두면 기울어져 있어도 항상 화면을 덮음).
  const waveDiagonalSize = Math.max(dims.w, dims.h) * 2.2;
  const waveRectHeight = waveDiagonalSize - waveCrestHeight;

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
  const waveTranslateY =
    stage >= STAGE.WAVE_RISE ? 0 : waveDiagonalSize + WAVE_HIDE_EXTRA_MARGIN;

  return (
    <Root>
      <EllipseWrapper $opacity={ellipseOpacity}>
        <Ellipse $scale={ellipseScale} />
      </EllipseWrapper>

      <WaveWrapper $size={waveDiagonalSize} $translateY={waveTranslateY}>
        <svg
          width={waveDiagonalSize}
          height={waveCrestHeight}
          viewBox="0 0 400 160"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <path
            d="M0,0 C52,0 52,150 104,150 C148,150 148,15 192,15 C228,15 228,158 264,158 C296,158 296,50 328,50 C364,50 364,155 400,155 L400,160 L0,160 Z"
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
