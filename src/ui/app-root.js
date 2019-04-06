import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {LoginPage} from 'ui/login/login';
import './layout.css';
import {NotesPage} from 'ui/notes-page';

export const PAGES_ENUM = {
  EMPTY: Symbol('empty'),
  LOGIN: Symbol('login'),
  NOTES: Symbol('notes')
};

export class AppRoot extends Component {
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
      case PAGES_ENUM.EMPTY:
        return null;
      case PAGES_ENUM.LOGIN:
        return <LoginPage authorized={this.onLoginSuccess}/>;
      case PAGES_ENUM.NOTES:
        return <NotesPage/>;
      default:
        throw new Error(`unknown page: ${page}`);
    }
  }

  onLoginSuccess = () => {
    this.props.changePage(PAGES_ENUM.NOTES);
  };
}

AppRoot.PropTypes = {
  page: PropTypes.string.isRequired,
  changePage: PropTypes.func.isRequired
};
