import {
  all,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import { push } from 'connected-react-router';

import noteStorage from 'storage/noteStorage';
import {
  CREATE_EMPTY_CHILD_ACTION,
  CHANGE_PARENT_BUTTON_CLICKED_ACTION,
  DELETE_NOTE_ACTION,
  createNoteSuccessAction,
  deleteNoteRequestSuccessAction,
} from './BottomBarActions';

function* createEmptyChild({ data: { parent } }) {
  const note = {
    name: 'new2',
    content: '',
  };

  const newNote = yield noteStorage.create(note, parent);
  newNote.parent = parent;
  yield put(createNoteSuccessAction(newNote));
}

function* handleChangeParentButtonClick({ data: { note } }) {
  yield put(push(`/change-note-parent/${note.id}`));
}

function* deleteNote({ data: { note } }) {
  yield noteStorage.remove(note);
  yield put(deleteNoteRequestSuccessAction(note));
}

export function* bottomBarInit() {
  yield all([takeEvery(CREATE_EMPTY_CHILD_ACTION, createEmptyChild)]);
  yield all([
    takeEvery(
      CHANGE_PARENT_BUTTON_CLICKED_ACTION,
      handleChangeParentButtonClick,
    ),
    takeEvery(DELETE_NOTE_ACTION, deleteNote),
  ]);
}
