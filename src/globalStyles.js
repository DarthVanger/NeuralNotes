import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    font-size: initial;
    font-family: 'Raleway', sans-serif;
  }
  
  #app-root {
    position: relative;
    height: 100%;
  }
  
  .vis-network {
    background-color: #222;
    
    :focus,
    canvas:focus {
      outline: none;
    }
  }
`;
