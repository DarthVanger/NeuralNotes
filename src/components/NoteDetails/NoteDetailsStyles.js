import { colors } from 'colors';
import styled from 'styled-components';

export const StyledNoteDetailsScreen = styled.div`
  background: ${colors.elevationOverlay02dp};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const StyledNoteNameEditor = styled.input`
  border: none;
  outline: none;
  box-shadow: none;

  background-color: ${colors.elevationOverlay02dp};
  color: ${colors.onSurfaceHighEmphasis};

  flex-grow: 0;
  padding: 1rem;
`;

export const StyledNoteContentEditor = styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  outline: none;
  box-shadow: none;

  background-color: ${colors.elevationOverlay02dp};

  flex-grow: 1;
  padding: 1rem;
`;
