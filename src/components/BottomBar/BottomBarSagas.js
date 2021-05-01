import {
  all,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import { push } from 'connected-react-router';

import noteStorage from 'storage/noteStorage';
import {
  ADD_NOTE_BUTTON_CLICKED_ACTION,
  CHANGE_PARENT_BUTTON_CLICKED_ACTION,
  DELETE_NOTE_ACTION,
  deleteNoteRequestSuccessAction,
} from './BottomBarActions';

function* handleAddNoteButtonClick() {
  console.log('handleAddNoteButtonClick');
  yield put(push('/note/new'));
}

function* handleChangeParentButtonClick({ data: { note } }) {
  yield put(push(`/change-note-parent/${note.id}`));
}

function* deleteNote({ data: { note } }) {
  yield noteStorage.remove(note);
  yield put(deleteNoteRequestSuccessAction(note));
  yield put(push('/notes'));
}

export function* bottomBarInit() {
  yield all([
    takeEvery(
      CHANGE_PARENT_BUTTON_CLICKED_ACTION,
      handleChangeParentButtonClick,
    ),
    takeEvery(DELETE_NOTE_ACTION, deleteNote),
    takeEvery(ADD_NOTE_BUTTON_CLICKED_ACTION, handleAddNoteButtonClick),
  ]);
}
