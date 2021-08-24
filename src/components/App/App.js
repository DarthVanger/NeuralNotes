import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { LoginPageContainer } from 'components/LoginPage/LoginPageContainer';
import { NoteDetailsPage } from 'components/NoteDetails/NoteDetailsPage';
import { NotesPageComponent } from 'components/NotesPage/NotesPageComponent';
import { SearchPageComponent } from 'components/SearchPage/SearchPageComponent';
import { UploadsPage } from 'components/Uploads/UploadsPage';
import { isUserSignedInSelector } from 'components/LoginPage/LoginPageSelectors';
import { colors } from 'colors';
import SessionExpiredDialog from 'components/SessionExpiredDialog/SessionExpiredDialog';
import UnexpectedErrorDialog from './UnexpectedErrorDialog';
import UnexpectedErrorDialogErrorBoundary from './UnexpectedErrorDialogErrorBoundary';
import AppErrorBoundary from './AppErrorBoundary';

const StyledApp = styled.div`
  background: ${colors.surface};
  min-height: 100vh;
`;

export const App = () => {
  const isUserSignedIn = useSelector(isUserSignedInSelector);
  return (
    <StyledApp>
      <AppErrorBoundary>
        <Switch>
          <Route exact path="/">
            {isUserSignedIn && <Redirect to="/notes" />}
            {!isUserSignedIn && <LoginPageContainer />}
          </Route>

          {!isUserSignedIn && <Redirect to="/" />}

          <Route path="/notes">
            <NotesPageComponent />
          </Route>
          <Route exact path="/note/:id">
            <NoteDetailsPage />
          </Route>
          <Route path="/uploads">
            <UploadsPage />
          </Route>
          <Route path="/search">
            <SearchPageComponent />
          </Route>
          <Route path="*">
            <div style={{ height: '100vh', padding: '1em' }}>
              <Typography variant="h4">
                Whoops, this page doesn&apos;t exist.
              </Typography>
            </div>
          </Route>
        </Switch>
        <SessionExpiredDialog />
      </AppErrorBoundary>
      <UnexpectedErrorDialogErrorBoundary>
        <UnexpectedErrorDialog />
      </UnexpectedErrorDialogErrorBoundary>
    </StyledApp>
  );
};
