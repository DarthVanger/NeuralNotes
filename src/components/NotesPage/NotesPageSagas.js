import { all, call, put, takeEvery } from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import {
  CHANGE_USER_HELP_SEEN_ACTION,
  REQUEST_NOTE_TEXT_ACTION,
  changeUserHelpSeenAction,
  changeNoteTextAction,
  changeSelectedNoteAction
} from 'components/NotesPage/NotesPageActions';
import thoughtStorage from 'storage/thought-storage';
import { APP_INIT_SUCCESS } from 'components/App/AppActions';

const HELP_VIEWED_KEY = 'controls_help:viewed';
const LOADING_NOTE_MESSAGE = 'loading note contents...';

function* saveHelpSeenState({ data }) {
  yield call([localStorage, localStorage.setItem], HELP_VIEWED_KEY, data);
}

function* readHelpSeenState() {
  const value = Boolean(
    JSON.parse(
      yield call([localStorage, localStorage.getItem], HELP_VIEWED_KEY)
    )
  );
  yield put(changeUserHelpSeenAction(value));
}

function* setRootNote() {
  yield put(changeSelectedNoteAction(thoughtStorage.getRoot()));
}

function* requestNoteText({ data }) {
  yield put(changeNoteTextAction(LOADING_NOTE_MESSAGE));
  const noteText = yield call(thoughtStorage.getThoughtContent, data);
  console.debug('ThoughtContentController.loadThought(), loaded thought content: ', noteText);
  yield put(changeNoteTextAction(noteText));
}

export function* notesInit() {
  yield all([
    readHelpSeenState(),
    takeEvery(APP_INIT_SUCCESS, setRootNote),
    takeEvery(CHANGE_USER_HELP_SEEN_ACTION, saveHelpSeenState),
    takeEvery(REQUEST_NOTE_TEXT_ACTION, requestNoteText)
  ]);
}
