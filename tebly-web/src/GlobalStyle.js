import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Pretendard Variable', sans-serif;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    -webkit-overflow-scrolling: touch;
  }

  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${(props) => props.theme.colors.bg};
    color: ${(props) => props.theme.colors.gray900};
  }

  /* 채팅 화면은 배경이 흰색이라, ChatPage가 마운트되어있는 동안엔
     body[data-chat-page]를 붙여서 body 배경도 같이 흰색으로 맞춤 */
  body[data-chat-page] {
    background-color: ${(props) => props.theme.colors.white};
  }

  a[href^="tel"],
  a[href^="sms"],
  a[href^="mailto"],
  a[x-apple-data-detectors],
  span[x-apple-data-detectors] {
    color: inherit !important;
    text-decoration: inherit !important;
  }
`;