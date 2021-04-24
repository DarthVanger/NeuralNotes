import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    font-size: initial;
    font-family: 'Roboto', sans-serif;
    color: white;
    margin: 0;
  }

  input, button, textarea, select {
    font-family: inherit;
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
