import styled from 'styled-components';

export const StyledNotesMindMap = styled.div`
  position: absolute;
  bottom: 0;
  height: calc(100% - 125px);
  width: 100%;
  overflow: scroll;

  svg {
    background: red;
    pointer-events: none;
  }
`;
