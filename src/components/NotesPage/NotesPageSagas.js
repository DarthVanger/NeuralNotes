import {
  all,
  call,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import {
  CHANGE_USER_HELP_SEEN_ACTION,
  changeUserHelpSeenAction,
} from 'components/NotesPage/NotesPageActions';

const HELP_VIEWED_KEY = 'controls_help:viewed';

function* saveHelpSeenState({ data }) {
  yield call([localStorage, localStorage.setItem], HELP_VIEWED_KEY, data);
}

function* readHelpSeenState() {
  const value = Boolean(
    JSON.parse(
      yield call([localStorage, localStorage.getItem], HELP_VIEWED_KEY),
    ),
  );
  yield put(changeUserHelpSeenAction(value));
}

export function* notesInit() {
  yield all([
    readHelpSeenState(),
    takeEvery(CHANGE_USER_HELP_SEEN_ACTION, saveHelpSeenState),
  ]);
}
