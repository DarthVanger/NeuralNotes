import React, {Component} from 'react';
import * as ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap-social/bootstrap-social.css';
import 'vis/dist/vis.css';

import thoughtStorage from 'storage/thought-storage';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import googleApiLoader from 'api/google-api-loader';
import {AppRoot, PAGES_ENUM} from 'ui/app-root';
import auth from 'auth';
import googleDriveApi from 'api/google-drive-api';

const spinner = siteGlobalLoadingBar.create();

class App extends Component {
  state = {page: PAGES_ENUM.EMPTY};

  constructor() {
    super();
    if (auth.signedIn()) {
      console.info('User is signed in');
      this.loadApp();
    } else {
      this.changePage(PAGES_ENUM.LOGIN);
    }
  }

  render() {
    const {page} = this.state;
    return (
      <AppRoot page={page} changePage={this.changePage}/>
    );
  }

  changePage = pageName => {
    this.setState({page: pageName});
  };

  loadApp() {
    console.info('Loading app...');
    spinner.show('Loading Google Api');

    googleApiLoader
      .load()
      .then(googleDriveApi.loadDriveApi)
      .then(() => thoughtStorage.scanDrive())
      .then(() => this.changePage(PAGES_ENUM.NOTES))
      .finally(() => spinner.hide());
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app-root')
);
