import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import ScheduleList from '../../assets/onboarding/schedule-list.svg?react';
import ScheduleCard from '../../assets/onboarding/schedule-card.svg?react';
import Calendar from '../../assets/onboarding/calendar.svg?react';
import Ocr from '../../assets/onboarding/ocr.svg?react';
import Invitation from '../../assets/onboarding/invitation.svg?react';
import AppointmentInviteCard from '../../assets/onboarding/appointment-invite-card.svg?react';
import Notification from '../../assets/onboarding/notification.svg?react';
import NotificationDetail from '../../assets/onboarding/notification-detail.svg?react';

const Wrapper = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.bg};
  position: relative;
  overflow: hidden;
`;

const SlideContainer = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  overflow: hidden;
`;

const SlideWrapper = styled.div`
  display: flex;
  width: 100%;
  transition: transform 0.3s ease;
  transform: translateX(${({ $step }) => -$step * 100}%);
`;

const Slide = styled.div`
  min-width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.p`
  ${({ theme }) => theme.typography.h2};
  color: #000;
  text-align: center;
  white-space: pre-line;
  margin: 0;
  margin-top: 52px;
`;

const ImageArea = styled.div`
  position: relative;
  margin-top: 57px;
  width: 100%;
`;

const IndicatorWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  position: fixed;
  bottom: ${54 + 21 + 60}px;
  left: 50%;
  transform: translateX(-50%);
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary100 : theme.colors.gray300};
`;

const BtnWrapper = styled.div`
  position: fixed;
  bottom: 21px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 480px;
`;

const NextBtn = styled.button`
  width: 100%;
  height: 54px;
  border-radius: 16px;
  border: none;
  background: ${({ theme }) => theme.colors.primary100};
  ${({ theme }) => theme.typography.btn1};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

const STEP_COUNT = 4;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const touchStartX = useRef(null);
  const timerRef = useRef(null);

  function resetTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setStep(prev => (prev + 1) % STEP_COUNT); // ✅ 마지막이면 다시 첫번째로
    }, 3000);
  }

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (diff > 50 && step < STEP_COUNT - 1) {
      setStep(prev => prev + 1);
    } else if (diff < -50 && step > 0) {
      setStep(prev => prev - 1);
    }
    touchStartX.current = null;
    resetTimer(); // ✅ 스와이프 후 타이머 리셋
  }

  function handleStart() {
    localStorage.setItem('onboardingDone', 'true');
    navigate('/login'); // TODO: 로그인 페이지로 이동
  }

  return (
    <Wrapper
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <SlideContainer>
        <SlideWrapper $step={step}>

          {/* 1페이지 */}
          <Slide>
            <Title>{`복잡한 약속 잡기\n이제 테블리에게 맡겨요`}</Title>
            <ImageArea>
              <div style={{ display: 'flex', justifyContent: 'center', borderRadius: '12px' }}>
                <ScheduleList width={256} height={348} />
              </div>
              <div style={{ position: 'absolute', top: '134px', left: '50%', transform: 'translateX(-50%)' }}>
                <ScheduleCard width={300} height={107} />
              </div>
            </ImageArea>
          </Slide>

          {/* 2페이지 */}
          <Slide>
            <Title>{`기존 시간표 캡쳐하면\n편안하게 일정 등록 완료!`}</Title>
            <ImageArea>
              <div style={{ marginLeft: '39px' }}>
                <Calendar width={256} height={330} />
              </div>
              <div style={{ position: 'absolute', top: '122px', left: `${39 + 80}px` }}>
                <Ocr width={232} height={255} />
              </div>
            </ImageArea>
          </Slide>

          {/* 3페이지 */}
          <Slide>
            <Title>{`초대장만 보내면\nAI가 알아서 약속을 잡아줘요`}</Title>
            <ImageArea>
              <div style={{ marginLeft: '50px' }}>
                <Invitation width={256} height={348} />
              </div>
              <div style={{ position: 'absolute', top: '77px', left: `${50 + 87}px` }}>
                <AppointmentInviteCard width={215} height={118} />
              </div>
            </ImageArea>
          </Slide>

          {/* 4페이지 */}
          <Slide>
            <Title>{`약속, 잊어버릴 걱정 없어요\n테블리가 먼저 알려드릴게요`}</Title>
            <ImageArea>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Notification width={256} height={377} />
              </div>
              <div style={{ position: 'absolute', top: '165px', left: '50%', transform: 'translateX(-50%)' }}>
                <NotificationDetail width={325} height={76} />
              </div>
            </ImageArea>
          </Slide>

        </SlideWrapper>
      </SlideContainer>

      <IndicatorWrapper>
        {Array.from({ length: STEP_COUNT }, (_, i) => (
          <Dot key={i} $active={i === step} />
        ))}
      </IndicatorWrapper>

      <BtnWrapper>
        <NextBtn onClick={handleStart}>
          테블리 시작하기
        </NextBtn>
      </BtnWrapper>
    </Wrapper>
  );
}