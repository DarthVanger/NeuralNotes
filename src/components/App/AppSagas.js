import {
  put,
  call,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import { toast } from 'react-toastify';

import auth from 'auth';
import { rootNoteFoundAction } from 'components/NotesMindMap/NotesMindMapActions';
import { authSuccess } from 'components/LoginPage/LoginPageSlice';
import noteStorage from 'storage/noteStorage';
import googleDriveApi from 'api/google-drive-api';
import googleApiLoader from 'api/google-api-loader';
// import { hideSpinner, showSpinner } from 'components/Spinner/SpinnerSagas';

import { push } from 'connected-react-router';

export function* loadApp() {
  console.info('Loading app...');
  // yield showSpinner('Loading Google Api');

  let initialNote;
  const lastViewedNoteId = localStorage.getItem('lastViewedNoteId');
  if (lastViewedNoteId) {
    initialNote = yield googleDriveApi.findNoteById(lastViewedNoteId);
  } else {
    initialNote = yield noteStorage.scanDrive();
  }

  yield put(rootNoteFoundAction(initialNote));
  yield put(push('/notes'));
  // yield hideSpinner();
}

export function* appInit() {
  yield googleApiLoader.load();
  yield googleDriveApi.loadDriveApi();

  yield call([toast, toast.configure], {
    position: toast.POSITION.BOTTOM_RIGHT,
  });
  if (auth.signedIn()) {
    console.info('User is signed in');
    yield loadApp();
  } else {
    yield takeEvery(authSuccess().type, loadApp);
    // yield put(push('/'));
  }
}
