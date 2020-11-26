import googleApiLoader from 'api/google-api-loader';
import googleDriveApi from 'api/google-drive-api';
import auth from 'auth';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import {
  put,
  call,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import noteStorage from 'storage/noteStorage';

import { AUTH_SUCCESS_ACTION } from 'components/LoginPage/LoginPageActions.js';
import { rootNoteFoundAction } from 'components/NotesMindMap/NotesMindMapActions';
import { hideSpinner, showSpinner } from 'components/Spinner/SpinnerSagas';

export function* loadApp() {
  console.info('Loading app...');
  yield googleApiLoader.load();
  yield googleDriveApi.loadDriveApi();

  yield showSpinner('Loading Google Api');

  let initialNote;
  const lastViewedNoteId = localStorage.getItem('lastViewedNoteId');
  if (lastViewedNoteId) {
    initialNote = yield googleDriveApi.findNoteById(lastViewedNoteId);
  } else {
    initialNote = yield noteStorage.scanDrive();
  }

  yield put(rootNoteFoundAction(initialNote));
  yield put(push('/notes'));
  yield hideSpinner();
}

export function* appInit() {
  yield call([toast, toast.configure], {
    position: toast.POSITION.BOTTOM_RIGHT,
  });
  if (auth.signedIn()) {
    console.info('User is signed in');
    yield loadApp();
  } else {
    yield takeEvery(AUTH_SUCCESS_ACTION, loadApp);
  }
}
