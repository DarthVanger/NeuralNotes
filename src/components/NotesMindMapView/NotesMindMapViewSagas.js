import { all, call, put, takeEvery } from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import {
  changeNoteTextAction,
  changeSelectedNoteAction,
  REQUEST_NOTE_TEXT_ACTION
} from 'components/NotesMindMapView/NotesMindMapViewActions';
import noteStorage from 'storage/note-storage';
import { APP_INIT_SUCCESS } from 'components/App/AppActions';

const LOADING_NOTE_MESSAGE = 'loading note contents...';

function* setRootNote() {
  yield put(changeSelectedNoteAction(noteStorage.getRoot()));
}

function* requestNoteText({ data }) {
  yield put(changeNoteTextAction(LOADING_NOTE_MESSAGE));
  const noteText = yield call(noteStorage.getNoteContent, data);
  console.debug('NoteContentController.loadNote(), loaded note content: ', noteText);
  yield put(changeNoteTextAction(noteText));
}

export function* noteMindMapInit() {
  yield all([
    takeEvery(APP_INIT_SUCCESS, setRootNote),
    takeEvery(REQUEST_NOTE_TEXT_ACTION, requestNoteText)
  ]);
}
