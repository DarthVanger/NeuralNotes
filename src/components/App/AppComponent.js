import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { NotesPageContainer } from 'components/NotesPage/NotesPageContainer';
import { PAGES_ENUM } from 'components/App/AppConstants';
import { LoginPageContainer } from 'components/LoginPage/LoginPageContainer';

export class AppComponent extends Component {
  render() {
    // TODO: remove it when project is moved to styled-components
    const element = document.getElementById('app-root');
    element.style.position = 'relative';
    element.style.height = '100%';

    return this.getPage();
  }

  getPage() {
    const { page } = this.props;
    switch (page) {
      case PAGES_ENUM.LOADING:
        return null;

      case PAGES_ENUM.LOGIN:
        return <LoginPageContainer/>;

      case PAGES_ENUM.NOTES:
        return <NotesPageContainer/>;

      default:
        throw new Error(`unknown page: ${page}`);
    }
  }
}

AppComponent.propTypes = {
  page: PropTypes.symbol.isRequired,
  changePage: PropTypes.func.isRequired
};
