import { all, takeEvery } from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import { SAVE_NOTE_CONTENT_ACTION } from 'components/NotesContentEditor/NotesContentEditorActions';
import uiErrorNotification from 'ui/ui-error-notification';
import noteStorage from 'storage/note-storage';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';

const spinner = siteGlobalLoadingBar.create('note text editor');

function* updateNoteContent({ data }) {
  console.debug('NoteContentController.updateNoteContent()');
  let savingNoteContentSpinner = spinner.create('saving note');
  savingNoteContentSpinner.show();

  console.debug('RealtimeSaving: Save note content: currentViewedNote: ', data);

  return noteStorage.update(data)
    .catch(function (error) {
      uiErrorNotification.show('Failed to save note content');
      console.error(error);
    })
    .finally(function () {
      savingNoteContentSpinner.hide();
    });
}

export function* notesContentEditorInit() {
  yield all([
    takeEvery(SAVE_NOTE_CONTENT_ACTION, updateNoteContent),
  ]);
}
