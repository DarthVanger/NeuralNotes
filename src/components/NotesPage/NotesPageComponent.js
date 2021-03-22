import React, { Component } from 'react';

import { BottomBar } from 'components/BottomBar/BottomBar';
import { NotesMindMapContainer } from 'components/NotesMindMap/NotesMindMapContainer';
import { TopBar } from 'components/TopBar/TopBar';

export class NotesPageComponent extends Component {
  render() {
    return (
      <>
        <TopBar />
        <NotesMindMapContainer />
        <BottomBar />
      </>
    );
  }
}
