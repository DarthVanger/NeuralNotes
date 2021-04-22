import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { LoginPageContainer } from 'components/LoginPage/LoginPageContainer';
import { NoteDetailsPage } from 'components/NoteDetails/NoteDetailsPage';
import { NotesPageComponent } from 'components/NotesPage/NotesPageComponent';
import { SearchPageComponent } from 'components/SearchPage/SearchPageComponent';
import { ChangeNoteParentPage } from 'components/ChangeNoteParentPage/ChangeNoteParentPage';
import { UploadsPage } from 'components/Uploads/UploadsPage';
import { isUserSignedInSelector } from 'components/LoginPage/LoginPageSelectors';
import { colors } from 'colors';

const AppWrapper = styled.div`
  background: ${colors.systemBarBack};
`;

export const App = () => {
  const isUserSignedIn = useSelector(isUserSignedInSelector);
  return (
    <AppWrapper>
      <Switch>
        <Route exact path="/">
          {isUserSignedIn && <Redirect to="/notes" />}
          {!isUserSignedIn && <LoginPageContainer />}
        </Route>

        {!isUserSignedIn && <Redirect to="/" />}

        <Route exact path="/notes">
          <NotesPageComponent />
        </Route>
        <Route exact path="/note/:id">
          <NoteDetailsPage />
        </Route>
        <Route exact path="/change-note-parent/:id">
          <ChangeNoteParentPage />
        </Route>
        <Route path="/uploads">
          <UploadsPage />
        </Route>
        <Route path="/search">
          <SearchPageComponent />
        </Route>
      </Switch>
    </AppWrapper>
  );
};
