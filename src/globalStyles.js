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
    font-family: 'Raleway', sans-serif;
    color: white;
    margin: 0;
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
