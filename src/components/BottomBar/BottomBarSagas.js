import {
  all,
  put,
  call,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';

import { apiCall } from 'api/api';

import noteStorage from 'storage/noteStorage';
import {
  ADD_NOTE_BUTTON_CLICKED_ACTION,
  CHANGE_PARENT_BUTTON_CLICKED_ACTION,
  DELETE_NOTE_ACTION,
  EDIT_NOTE_BUTTON_CLICKED_ACTION,
  deleteNoteRequestSuccessAction,
  deletNoteRequestFailAction,
} from './BottomBarActions';

import { editNoteAction } from 'components/NoteDetails/NoteDetailsActions';

function* handleAddNoteButtonClick() {
  yield put(push('/note/new'));
}

function* handleEditNoteButtonClick({ data: { note } }) {
  yield put(editNoteAction({ note }));
}

function* handleChangeParentButtonClick({ data: { note } }) {
  yield put(push(`/notes/change-parent/${note.id}`));
}

function* deleteNote({ data: note }) {
  try {
    yield apiCall(noteStorage.remove, note);
    yield put(deleteNoteRequestSuccessAction(note));
  } catch (error) {
    yield put(deletNoteRequestFailAction(note));
    yield call(toast.error, 'Failed to delete note');
  }
}

export function* bottomBarInit() {
  yield all([
    takeEvery(
      CHANGE_PARENT_BUTTON_CLICKED_ACTION,
      handleChangeParentButtonClick,
    ),
    takeEvery(DELETE_NOTE_ACTION, deleteNote),
    takeEvery(ADD_NOTE_BUTTON_CLICKED_ACTION, handleAddNoteButtonClick),
    takeEvery(EDIT_NOTE_BUTTON_CLICKED_ACTION, handleEditNoteButtonClick),
  ]);
}
