import { put, call, takeEvery } from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import { toast } from 'react-toastify';

import auth from 'auth';
import {
  rootNoteFoundAction,
  CHANGE_PAGE_ACTION
} from 'components/App/AppActions';
import { AUTH_SUCCESS_ACTION } from 'components/LoginPage/LoginPagesActions.js';
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
  const rootNote = yield noteStorage.scanDrive();
  yield put(rootNoteFoundAction(rootNote));
  yield setPageAction(PAGES_ENUM.NOTES);
  yield hideSpinner();
}

export function* appInit() {
  yield call([toast, toast.configure], {
    position: toast.POSITION.BOTTOM_RIGHT
  });
  if (auth.signedIn()) {
    console.info('User is signed in');
    yield loadApp();
  } else {
    yield takeEvery(AUTH_SUCCESS_ACTION, loadApp),

    yield setPageAction(PAGES_ENUM.LOGIN);
  }
}
