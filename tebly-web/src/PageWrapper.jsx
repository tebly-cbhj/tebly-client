import styled from 'styled-components';

const StyledPageWrapper = styled.div`
  width: 100%; /* 앱(웹뷰) 안에서는 스마트폰 화면 가로폭에 100% 딱 맞춤! */
  max-width: 390px; /* 컴퓨터(PC) 브라우저에서 볼 때 너무 넓어지는 것만 방지 */
  margin: 0 auto;
  align-items: center;
  
  // 세로 높이 세팅 - 헤더/네비게이션 바 제외한 나버지 부분 사용
  height: 100vh;
  overflow: hidden;
  
  // 배경 색
  background-color: ${(props) => props.theme.colors.bg};

  padding: 0 20px;
  box-sizing: border-box;

  // 내부 요소 배치 방향
  display: flex;
  flex-direction: column;
  position: relative;
`;

export function PageWrapper({ noNav, children, ...props }) {
  return <StyledPageWrapper {...props}>{children}</StyledPageWrapper>;
}