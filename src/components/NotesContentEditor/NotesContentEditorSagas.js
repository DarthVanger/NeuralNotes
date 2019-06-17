import { all, takeEvery } from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import { SAVE_NOTE_CONTENT_ACTION } from 'components/NotesContentEditor/NotesContentEditorActions';
import uiErrorNotification from 'ui/ui-error-notification';
import thoughtStorage from 'storage/thought-storage';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';

const spinner = siteGlobalLoadingBar.create('note text editor');

function* updateNoteContent({ data }) {
  console.debug('ThoughtContentController.updateNoteContent()');
  let savingThoughtContentSpinner = spinner.create('saving thought');
  savingThoughtContentSpinner.show();

  console.debug('RealtimeSaving: Save thought content: currentViewedThought: ', data);

  return thoughtStorage.update(data)
    .catch(function (error) {
      uiErrorNotification.show('Failed to save thought content');
      console.error(error);
    })
    .finally(function () {
      savingThoughtContentSpinner.hide();
    });
}

export function* notesContentEditorInit() {
  yield all([
    takeEvery(SAVE_NOTE_CONTENT_ACTION, updateNoteContent),
  ]);
}
