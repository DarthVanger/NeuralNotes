import styled from 'styled-components';
import { colors } from 'colors';

export const DefaultTextarea = styled.textarea`
  background-color: ${colors.darkViolet};
  padding: 0px;
  width: 100%;
  border: none;
  resize: none;
  border-radius: 4px;
  outline: none;
  box-shadow: none;
  font-family: Roboto;
`;

export const StyledNoteNameEditor = styled(DefaultTextarea)`
  text-align: center;
  height: 24px;
  line-height: 24px;
  color: ${colors.white87};
  font-size: 20px;
  overflow: hidden;
  font-weight: 500;
  margin-bottom: 16px;
`;

export const StyledNoteDetailsScreen = styled.div`
  height: 100vh;
  padding: 24px;
  background-color: ${colors.darkViolet};
`;

export const StyledNoteContentEditor = styled(DefaultTextarea)`
  height: 90%;
  line-height: 20px;
  color: ${colors.white60};
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0.25px;

  padding: 1rem;

  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #1c191f;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #4a3d57;
    border-radius: 1rem;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #6a5580;
  }
`;
