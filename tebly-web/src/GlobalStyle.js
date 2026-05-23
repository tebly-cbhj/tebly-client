import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Pretendard', sans-serif;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    
    background-color: ${(props) => props.theme.colors.bg};
    color: ${(props) => props.theme.colors.gray900};
  }
`;