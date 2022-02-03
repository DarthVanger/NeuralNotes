import styled from 'styled-components';
import { colors } from 'colors';

export const StyledNotesMindMap = styled.div`
  flex-grow: 1;
  background: ${colors.elevationOverlay02dp};

  /* Without "display: flex", the "height: 100%" for the <svg> inside doesn't work in Safari */
  display: flex;

  /* In order to implement keyboard shortcuts (to handle keydown events)
   * this div is made focusable (by setting tabindex="0" attribute).
   * By default when it's focused it gets a 1px blue outline. Remove this outline.
   */
  &:focus-visible {
    outline: none;
  }
`;
