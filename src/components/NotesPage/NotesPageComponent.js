import React, { Component } from 'react';
import styled from 'styled-components';

import { BottomBar } from 'components/BottomBar/BottomBar';
import { NotesMindMapContainer } from 'components/NotesMindMap/NotesMindMapContainer';
import { NotesPageTopBar } from './NotesPageTopBar/NotesPageTopBar';

const StyledNotesPage = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-content: stretch;
`;

export class NotesPageComponent extends Component {
  render() {
    return (
      <StyledNotesPage>
        <NotesPageTopBar />
        <NotesMindMapContainer />
        <BottomBar />
      </StyledNotesPage>
    );
  }
}
