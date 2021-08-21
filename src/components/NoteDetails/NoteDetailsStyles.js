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
  padding: 0;
  text-align: center;
  line-height: 56px;
  font-size: 20px;
  font-weight: 500;
`;

export const StyledNoteContentEditor = styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  border-radius: 4px;
  outline: none;
  box-shadow: none;

  color: ${colors.onSurfaceMediumEmphasis};
  background-color: ${colors.elevationOverlay02dp};

  flex-grow: 1;
  line-height: 20px;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0.25px;
  padding: 2rem;
`;

export const StyledSavingStatus = styled.div`
  position: absolute;
  top: 0.5em;
  left: 0.5em;
`;
