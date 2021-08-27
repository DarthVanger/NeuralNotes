import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  html, body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    height: 100%;
  }

  #app-root {
    height: 100%;
  }

  input, button, textarea, select {
    font-family: inherit;
  }
`;
