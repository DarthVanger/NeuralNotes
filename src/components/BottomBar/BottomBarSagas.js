import {
  all,
  call,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import noteStorage from 'storage/noteStorage';
import {
  CREATE_EMPTY_CHILD_ACTION,
  createNoteSuccessAction,
} from './BottomBarActions';

function* createEmptyChild({ data: { parent } }) {
  const note = {
    name: 'new2',
    content: '',
  };

  const newNote = yield noteStorage.create(note, parent);
  newNote.parent = parent;
  yield put(createNoteSuccessAction(newNote));
}

export function* bottomBarInit() {
  yield all([takeEvery(CREATE_EMPTY_CHILD_ACTION, createEmptyChild)]);
}
