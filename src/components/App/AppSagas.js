import { put } from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import auth from 'auth';
import { appInitSuccessAction, CHANGE_PAGE_ACTION } from 'components/App/AppActions';
import { PAGES_ENUM } from 'components/App/AppConstants';
import noteStorage from 'storage/noteStorage';
import googleDriveApi from 'api/google-drive-api';
import googleApiLoader from 'api/google-api-loader';
import { hideSpinner, showSpinner } from 'components/Spinner/SpinnerSagas';

export function setPageAction(data) {
  return put({ type: CHANGE_PAGE_ACTION, data });
}

export function* loadApp() {
  console.info('Loading app...');

  yield showSpinner('Loading Google Api');
  yield googleApiLoader.load();
  yield googleDriveApi.loadDriveApi();
  yield noteStorage.scanDrive();
  yield put(appInitSuccessAction());
  yield setPageAction(PAGES_ENUM.NOTES);
  yield hideSpinner();
}

export function* appInit() {
  if (auth.signedIn()) {
    console.info('User is signed in');
    yield loadApp();
  } else {
    yield setPageAction(PAGES_ENUM.LOGIN);
  }
}
