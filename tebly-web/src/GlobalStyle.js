import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Pretendard Variable', sans-serif;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
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

  a[href^="tel"],
  a[href^="sms"],
  a[href^="mailto"],
  a[x-apple-data-detectors],
  span[x-apple-data-detectors] {
    color: inherit !important;
    text-decoration: inherit !important;
  }
`;