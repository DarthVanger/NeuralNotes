import { colors } from 'colors';
import styled from 'styled-components';

export const StyledNoteDetailsScreen = styled.div`
  background: ${colors.elevationOverlay02dp};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const DefaultTextarea = styled.textarea`
  background-color: ${colors.elevationOverlay02dp};
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
  color: ${colors.onSurfaceHighEmphasis};
  font-size: 20px;
  font-weight: 500;
  flex-grow: 0;
`;

export const StyledNoteContentEditor = styled(DefaultTextarea)`
  flex-grow: 1;
  line-height: 20px;
  color: ${colors.onSurfaceMediumEmphasis};
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
