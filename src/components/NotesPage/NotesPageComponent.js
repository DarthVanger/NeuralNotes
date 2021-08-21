import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { BottomBar } from 'components/BottomBar/BottomBar';
import { NotesMindMapContainer } from 'components/NotesMindMap/NotesMindMapContainer';
import { NotesPageTopBar } from './NotesPageTopBar/NotesPageTopBar';
import { ChangeNoteParentPage } from './ChangeNoteParentPage/ChangeNoteParentPage';

const StyledNotesPage = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-content: stretch;
`;

export const NotesPageComponent = () => {
  const { path } = useRouteMatch();

  return (
    <StyledNotesPage>
      <Switch>
        <Route exact path={path}>
          <>
            <NotesPageTopBar />
            <NotesMindMapContainer />
            <BottomBar />
          </>
        </Route>
        <Route path={`${path}/change-parent/:noteId`}>
          <ChangeNoteParentPage />
        </Route>
      </Switch>
    </StyledNotesPage>
  );
};
