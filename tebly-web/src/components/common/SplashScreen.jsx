import { useEffect, useState } from 'react';
import styled from 'styled-components';
import LogoPrimary from '../../assets/logo/text-logo.svg?react';
import LogoWhite from '../../assets/logo/text-logo-white.svg?react';
import waveImg from '../../assets/icons/wave.png';

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
const WAVE_BOTTOM_BUFFER = 400;

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
  /* 서서히 시작해서 점점 빨라지는(가속) 느낌으로 - easeInCubic 계열 */
  transition: transform ${WAVE_DURATION}ms cubic-bezier(0.55, 0.055, 0.675, 0.19);
  pointer-events: none;
`;

// 사용자가 직접 만들어준 물결 이미지 — 비율 왜곡 없이 꽉 채우고(cover), 좌우가
// 잘리는 건 괜찮다고 확인받음. 이미지 하단이 아래 WaveRect와 이어지도록 하단 기준 정렬.
const WaveCrestImage = styled.div`
  width: 100%;
  background-image: url(${({ $src }) => $src});
  background-size: cover;
  background-position: bottom center;
  background-repeat: no-repeat;
`;

const WaveRect = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary100};
  margin-top: -8px;
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
  const waveTranslateY =
    stage >= STAGE.WAVE_RISE ? -waveCrestHeight : dims.h + WAVE_HIDE_EXTRA_MARGIN;

  return (
    <Root>
      <EllipseWrapper $opacity={ellipseOpacity}>
        <Ellipse $scale={ellipseScale} />
      </EllipseWrapper>

      <WaveWrapper $translateY={waveTranslateY}>
        <WaveCrestImage $src={waveImg} style={{ height: waveCrestHeight }} />
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
