import {
  put,
  call,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import googleDriveApi from 'api/google-drive-api';
import { AUTHORIZED_USER_OPENED_APP } from 'components/App/AppActions';
import { loadGoogleApi } from 'components/App/AppSagas';
import noteStorage from 'storage/noteStorage';
import { AUTH_SUCCESS_ACTION } from 'components/LoginPage/LoginPageActions';

import { rootNoteFoundAction } from 'components/NotesMindMap/NotesMindMapActions';

function* loadGoogleDriveApi() {
  yield call(googleDriveApi.loadDriveApi);
  console.debug('load google drive api success');
}

function* loadInitialNote() {
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
  yield call(loadGoogleApi);
  yield call(loadGoogleDriveApi);
  yield call(loadInitialNote);
}

function* handleAuthSuccess() {
  yield call(loadGoogleDriveApi);
  yield call(loadInitialNote);
}

export function* notesPageInit() {
  yield takeEvery(AUTHORIZED_USER_OPENED_APP, handleAuthorizedUserOpenedApp);
  yield takeEvery(AUTH_SUCCESS_ACTION, handleAuthSuccess);
}
