import React, { Component } from 'react';

import { BottomBar } from 'components/BottomBar/BottomBar';
import { NotesMindMapContainer } from 'components/NotesMindMap/NotesMindMapContainer';
import { NotesPageTopBar } from './NotesPageTopBar/NotesPageTopBar';

export class NotesPageComponent extends Component {
  render() {
    return (
      <>
        <NotesPageTopBar />
        <NotesMindMapContainer />
        <BottomBar />
      </>
    );
  }
}
