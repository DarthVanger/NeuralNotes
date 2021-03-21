import { toast } from 'react-toastify';
import { all, takeEvery, put, call } from 'redux-saga/effects';
import noteStorage from 'storage/noteStorage';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';

import { EDIT_NOTE_BUTTON_CLICKED_ACTION } from 'components/BottomBar/BottomBarActions';
import {
  noteNameUpdateRequestSuccessAction,
  noteContentUpdateRequestSuccessAction,
  noteContentFetchSuccessAction,
} from './NoteDetailsActions';
import { push } from 'connected-react-router';

import {
  EDITOR_NOTE_NAME_CHANGED_ACTION,
  EDITOR_NOTE_CONTENT_CHANGED_ACTION,
} from './NoteDetailsActions';

const spinner = siteGlobalLoadingBar.create('note text editor');

function* updateNoteName({ data: { note, newNoteName } }) {
  const newNote = yield noteStorage.updateNoteName({
    note,
    newName: newNoteName,
  });
  yield put(noteNameUpdateRequestSuccessAction(newNote));
}

function* updateNoteContent({ data: { note, noteContent } }) {
  let newNote = { ...note, content: noteContent };
  let savingNoteContentSpinner = spinner.create('saving note content');
  savingNoteContentSpinner.show();

  console.debug(
    'RealtimeSaving: Save note content: currentViewedNote: ',
    newNote,
  );

  try {
    const returnedNote = yield noteStorage.update(newNote);
    yield put(noteContentUpdateRequestSuccessAction(returnedNote));
    savingNoteContentSpinner.hide();
  } catch (error) {
    toast.error('Failed to save note content');
    console.error(error);
  }
}

function* handleEditNoteButtonClick({ data: { note } }) {
  yield put(push(`/note/${note.id}`));
  const noteContent = yield call(noteStorage.getNoteContent, note);
  yield put(noteContentFetchSuccessAction(noteContent));
}

export function* noteDetailsInit() {
  yield all([takeEvery(EDITOR_NOTE_NAME_CHANGED_ACTION, updateNoteName)]);
  yield all([takeEvery(EDITOR_NOTE_CONTENT_CHANGED_ACTION, updateNoteContent)]);
  yield all([
    takeEvery(EDIT_NOTE_BUTTON_CLICKED_ACTION, handleEditNoteButtonClick),
  ]);
}
