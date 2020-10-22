import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { ThemeProvider } from '@material-ui/styles';


import { NotesPageContainer } from 'components/NotesPage/NotesPageContainer';
import { PAGES_ENUM } from 'components/App/AppConstants';
import { LoginPageContainer } from 'components/LoginPage/LoginPageContainer';
import { UploadsPage } from 'components/Uploads/UploadsPage';
import { SearchPageComponent } from 'components/SearchPage/SearchPageComponent';

import { NoteDetailsPage } from 'components/NoteDetailsPage/NoteDetailsPage';

import { theme } from '../../theme';


export class AppComponent extends PureComponent {
  render() {
    const { page } = this.props;
    switch (page) {
      case PAGES_ENUM.LOADING:
        return null;

      case PAGES_ENUM.LOGIN:
        return <LoginPageContainer />;

      case PAGES_ENUM.NOTES:
        return (
          <ThemeProvider theme={theme}>
            <NotesPageContainer />;
          </ThemeProvider>
        );

      case PAGES_ENUM.NOTE_DETAILS:
        return <NoteDetailsPage />;
      

      case PAGES_ENUM.UPLOADS:
        return (
          <ThemeProvider theme={theme}>
            <UploadsPage />
          </ThemeProvider>
        );


      case PAGES_ENUM.SEARCH:
        return <SearchPageComponent />;

      default:
        throw new Error(`unknown page: ${page}`);
    }
  }
}

AppComponent.propTypes = {
  page: PropTypes.symbol.isRequired,
  changePage: PropTypes.func.isRequired,
};
