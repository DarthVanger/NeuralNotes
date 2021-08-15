import React from 'react';

import { NotesMindMapContainer } from 'components/NotesMindMap/NotesMindMapContainer';
import { TopBar } from 'components/TopBar/TopBar';
import { TopBarLeftButtons } from 'components/TopBar/TopBarLeftButtons';
import { TopBarPageTitle } from 'components/TopBar/TopBarPageTitle';
import { BackButton } from 'components/BackButton/BackButton';

export const ChangeNoteParentPage = () => {
  return (
    <>
      <TopBar>
        <TopBarLeftButtons>
          <BackButton to="/notes" />
        </TopBarLeftButtons>
        <TopBarPageTitle>Change Parent</TopBarPageTitle>
      </TopBar>
      <NotesMindMapContainer />
    </>
  );
};
