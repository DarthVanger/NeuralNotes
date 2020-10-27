import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { NotesPageContainer } from 'components/NotesPage/NotesPageContainer';
import { LoginPage } from 'components/LoginPage/LoginPage';
import { UploadsPage } from 'components/Uploads/UploadsPage';
import { SearchPageComponent } from 'components/SearchPage/SearchPageComponent';
import { NoteDetailsPage } from 'components/NoteDetails/NoteDetailsPage';

import { Switch, Route } from 'react-router-dom';
import { theme } from '../../theme';
export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/">
          <LoginPage />
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
