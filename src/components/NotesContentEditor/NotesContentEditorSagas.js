import {
  all,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import { SAVE_NOTE_CONTENT_ACTION } from 'components/NotesContentEditor/NotesContentEditorActions';
import { toast } from 'react-toastify';
import noteStorage from 'storage/noteStorage';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';

const spinner = siteGlobalLoadingBar.create('note text editor');

function* updateNoteContent({ data }) {
  console.debug('NoteContentController.updateNoteContent()');
  let savingNoteContentSpinner = spinner.create('saving note');
  savingNoteContentSpinner.show();

  console.debug('RealtimeSaving: Save note content: currentViewedNote: ', data);

  try {
    yield noteStorage.update(data);
    savingNoteContentSpinner.hide();
  } catch (error) {
    toast.error('Failed to save note content');
    console.error(error);
  }
}

export function* notesContentEditorInit() {
  yield all([takeEvery(SAVE_NOTE_CONTENT_ACTION, updateNoteContent)]);
}
