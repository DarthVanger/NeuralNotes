import React from 'react';

import { ThemeProvider } from '@material-ui/styles';
import { Switch, Route } from 'react-router-dom';

import { LoginPageContainer } from 'components/LoginPage/LoginPageContainer';
import { NoteDetailsPage } from 'components/NoteDetails/NoteDetailsPage';
import { NotesPageContainer } from 'components/NotesPage/NotesPageContainer';
import { SearchPageComponent } from 'components/SearchPage/SearchPageComponent';
import { UploadsPage } from 'components/Uploads/UploadsPage';

import { theme } from '../../theme';
export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/">
          <LoginPageContainer />
        </Route>
        <Route exact path="/notes">
          <NotesPageContainer />
        </Route>
        <Route exact path="/note">
          <NoteDetailsPage />
        </Route>
        <Route path="/uploads">
          <UploadsPage />
        </Route>
        <Route path="/search">
          <SearchPageComponent />
        </Route>
      </Switch>
    </ThemeProvider>
  );
};
