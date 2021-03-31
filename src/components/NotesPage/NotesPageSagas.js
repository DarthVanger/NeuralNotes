import {
  put,
  call,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import googleDriveApi from 'api/google-drive-api';
import {
  AUTHORIZED_USER_OPENED_APP,
  loadGoogleApiAction,
} from 'components/App/AppActions';
import noteStorage from 'storage/noteStorage';
import { LOAD_GOOGLE_API_SUCCESS_ACTION } from 'components/LoginPage/LoginPageActions';

import { rootNoteFoundAction } from 'components/NotesMindMap/NotesMindMapActions';

function* handleLoadGoogleApiSuccess() {
  yield call(googleDriveApi.loadDriveApi);
  console.debug('load google drive api success');

  let initialNote;
  const lastViewedNoteId = localStorage.getItem('lastViewedNoteId');
  if (lastViewedNoteId) {
    initialNote = yield call(noteStorage.getNoteById, lastViewedNoteId);
  } else {
    initialNote = yield call(noteStorage.scanDrive);
  }

  yield put(rootNoteFoundAction(initialNote));
}

function* handleAuthorizedUserOpenedApp() {
  yield put(loadGoogleApiAction());
}

export function* notesPageInit() {
  yield takeEvery(AUTHORIZED_USER_OPENED_APP, handleAuthorizedUserOpenedApp);
  yield takeEvery(LOAD_GOOGLE_API_SUCCESS_ACTION, handleLoadGoogleApiSuccess);
}
