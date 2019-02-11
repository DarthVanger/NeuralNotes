import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap-social/bootstrap-social.css';
import 'vis/dist/vis.css';

import thoughtStorage from 'storage/thought-storage';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import googleApiLoader from 'api/google-api-loader';
import appRootComponent from 'ui/app-root';
import auth from 'auth';
import googleDriveApi from 'api/google-drive-api';

var spinner = siteGlobalLoadingBar.create();

run();

function run() {
  if (auth.signedIn()) {
    console.info('User is signed in');
    loadApp();
  } else {
    appRootComponent.render({
      page: 'login'
    });
  }
}

function loadApp() {
  console.info('Loading app...');
  spinner.show('Loading Google Api');

  googleApiLoader
    .load()
    .then(googleDriveApi.loadDriveApi)
    .then(function () {
      return thoughtStorage.scanDrive()
    })
    .then(function () {
      appRootComponent.render({
        page: 'notes'
      });
    })
    .finally(function () {
      spinner.hide();
    });
}
