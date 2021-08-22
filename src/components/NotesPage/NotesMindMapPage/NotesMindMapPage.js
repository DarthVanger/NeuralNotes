import React from 'react';

import { NotesPageTopBar } from '../NotesPageTopBar/NotesPageTopBar';
import { NotesMindMapContainer } from 'components/NotesMindMap/NotesMindMapContainer';
import { BottomBar } from 'components/BottomBar/BottomBar';

const NotesMindMapPage = () => {
  return (
    <>
      <NotesPageTopBar />
      <NotesMindMapContainer />
      <BottomBar />
    </>
  );
};

export default NotesMindMapPage;
