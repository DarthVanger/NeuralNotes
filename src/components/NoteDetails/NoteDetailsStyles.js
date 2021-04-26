import { colors } from 'colors';
import styled from 'styled-components';

export const StyledNoteDetailsScreen = styled.div`
  background: ${colors.mainBackground};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
`;

export const DefaultTextarea = styled.textarea`
  background-color: ${colors.noteBackground};
  padding: 0;
  width: 100%;
  border: none;
  resize: none;
  border-radius: 4px;
  outline: none;
  box-shadow: none;
`;

export const StyledNoteNameEditor = styled(DefaultTextarea)`
  text-align: center;
  line-height: 56px;
  color: ${colors.titleColor};
  font-size: 20px;
  font-weight: 500;
  flex-grow: 0;
  margin-top: -24px; // override status message 'Saved...'
`;

export const StyledNoteContentEditor = styled(DefaultTextarea)`
  flex-grow: 1;
  line-height: 20px;
  color: ${colors.textColor};
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0.25px;
  padding: 2rem;
`;
