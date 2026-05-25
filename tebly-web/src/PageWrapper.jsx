import styled from 'styled-components';

export const PageWrapper = styled.div`
  // 가로 너비 세팅
  width: 100%;
  max-width: 390px; 
  margin: 0 auto; 

  // 세로 높이 세팅 - 헤더/네비게이션 바 제외한 나버지 부분 사용
  min-height: 100vh;
  
  // 배경 색
  background-color: ${(props) => props.theme.colors.bg};

  // 좌우 기본 여백
  padding: 0 20px; 
  box-sizing: border-box;

  // 내부 요소 배치 방향
  display: flex;
  flex-direction: column;
  position: relative;
`;