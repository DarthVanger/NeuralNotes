import { all, takeEvery, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import {
  EDITOR_NOTE_NAME_CHANGED_ACTION,
  EDITOR_NOTE_CONTENT_CHANGED_ACTION,
} from './NoteDetailsActions';

import noteStorage from 'storage/noteStorage';

import { noteNameUpdateRequestSuccessAction } from 'components/NotesMindMap/NotesMindMapActions';

import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';

const spinner = siteGlobalLoadingBar.create('note text editor');

function* updateNoteName({ data: { note, newNoteName } }) {
  const newNote = yield noteStorage.updateNoteName({
    note,
    newName: newNoteName,
  });
  yield put(noteNameUpdateRequestSuccessAction(newNote));
}

function* updateNoteContent({ data: { note, noteText } }) {
  let newNote = { ...note, content: noteText };
  let savingNoteContentSpinner = spinner.create('saving note');
  savingNoteContentSpinner.show();

  console.debug(
    'RealtimeSaving: Save note content: currentViewedNote: ',
    newNote,
  );

  try {
    yield noteStorage.update(newNote);
    savingNoteContentSpinner.hide();
  } catch (error) {
    toast.error('Failed to save note content');
    console.error(error);
  }
}

export function* noteDetailsInit() {
  yield all([takeEvery(EDITOR_NOTE_NAME_CHANGED_ACTION, updateNoteName)]);
  yield all([takeEvery(EDITOR_NOTE_CONTENT_CHANGED_ACTION, updateNoteContent)]);
}
