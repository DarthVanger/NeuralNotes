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
import { getMindMapFromLocalStorage } from 'storage/notesMindMapLocalStorage';
import { notesGraphLoadedFromLocalStorageAction } from 'components/NotesPage/NotesPageActions';
import { apiCall } from 'api/api';

import {
  initialNoteFetchedAction,
  RESET_MIND_MAP_TO_ROOT_NODE,
} from 'components/NotesMindMap/NotesMindMapActions';

function* loadGoogleDriveApi() {
  yield call(googleDriveApi.loadDriveApi);
  console.debug('load google drive api success');
}

function* loadInitialNotesGraph() {
  const notesMindMapFromLocalStorage = getMindMapFromLocalStorage();

  if (notesMindMapFromLocalStorage) {
    yield put(
      notesGraphLoadedFromLocalStorageAction(notesMindMapFromLocalStorage),
    );
  } else {
    const rootNote = yield call(loadRootNote);
    yield put(initialNoteFetchedAction(rootNote));
  }
}

function* loadRootNote() {
  const rootNote = yield apiCall(noteStorage.scanDrive);
  return rootNote;
}

function* resetMindMapToRootNode() {
  const rootNote = yield call(loadRootNote);
  yield put(initialNoteFetchedAction(rootNote));
}

function* handleAuthorizedUserOpenedApp() {
  yield call(loadGoogleApi);
  yield call(loadGoogleDriveApi);
  yield call(loadInitialNotesGraph);
}

function* handleAuthSuccess() {
  yield call(loadGoogleDriveApi);
  yield call(loadInitialNotesGraph);
}

export function* notesPageInit() {
  yield takeEvery(AUTHORIZED_USER_OPENED_APP, handleAuthorizedUserOpenedApp);
  yield takeEvery(AUTH_SUCCESS_ACTION, handleAuthSuccess);
  yield takeEvery(RESET_MIND_MAP_TO_ROOT_NODE, resetMindMapToRootNode);
}
