import styled from 'styled-components';

export const StyledNoteNameEditor = styled.textarea`
  background-color: #181818;
  height: 40px;
  width: 100%;
  line-height: 40px;
  padding: 0 16px;
  border-radius: 4px;
  color: #dfdfdf;
  font-size: 18px;
  resize: none;
  overflow: hidden;
  border: none;
  box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.05),
    inset -1px 1px 2px rgba(0, 0, 0, 0.2), inset 1px -1px 2px rgba(0, 0, 0, 0.2);
`;

export const StyledDetailsScreen = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #202020;
`;

export const StyledNoteContentEditor = styled.textarea`
  background-color: #181818;
  width: 100%;
  padding: 8px 16px;
  border-radius: 4px;
  color: #959595;
  font-size: 14px;
  line-height: 16px;
  resize: none;
  height: 100%;
  border: none;
  box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.05),
    inset -1px 1px 2px rgba(0, 0, 0, 0.2), inset 1px -1px 2px rgba(0, 0, 0, 0.2);
`;
