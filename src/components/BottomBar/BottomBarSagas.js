import {
  all,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import { push } from 'connected-react-router';
import { apiCall } from 'api/api';

import noteStorage from 'storage/noteStorage';
import {
  ADD_NOTE_BUTTON_CLICKED_ACTION,
  CHANGE_PARENT_BUTTON_CLICKED_ACTION,
  DELETE_NOTE_ACTION,
  deleteNoteRequestSuccessAction,
} from './BottomBarActions';
import { toast } from 'react-toastify';

function* handleAddNoteButtonClick() {
  console.log('handleAddNoteButtonClick');
  yield put(push('/note/new'));
}

function* handleChangeParentButtonClick({ data: { note } }) {
  yield put(push(`/notes/change-parent/${note.id}`));
}

function* deleteNote({ data: { note } }) {
  yield apiCall(noteStorage.remove, note);
  yield put(deleteNoteRequestSuccessAction(note));
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
