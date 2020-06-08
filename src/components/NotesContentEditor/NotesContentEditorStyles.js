import styled from 'styled-components';

export const StyledSelectedNotesContent = styled.div`
  position: absolute;
  z-index: 1;
  top: 65px;
  height: 4em;
  padding: 0;
  width: 100%;
`;

export const StyledTextArea = styled.textarea`
  background-color: #edf3ff;
  height: 100%;
  width: 100%;
  padding: 0.5em;

  /* disable border on focus */
  border: none;
  overflow: auto;
  outline: none;
  box-shadow: none;
`;

export const StyledLink = styled.a`
  display: block;
`;
