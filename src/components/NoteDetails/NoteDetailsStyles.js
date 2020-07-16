import styled from 'styled-components';

export const DefaultTextarea = styled.textarea`
  background-color: #181818;
  padding: 0 16px;
  width: 100%;
  border: none;
  resize: none;
  border-radius: 4px;
  outline: none;
  box-shadow: none;
`;

export const StyledNoteNameEditor = styled(DefaultTextarea)`
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: #dfdfdf;
  font-size: 18px;
  overflow: hidden;
`;

export const StyledDetailsScreen = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #181818;
`;

export const StyledNoteContentEditor = styled(DefaultTextarea)`
  height: 100%;
  line-height: 16px;
  color: #959595;
  font-size: 14px;
`;
