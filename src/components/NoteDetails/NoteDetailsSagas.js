import { all, takeEvery, put } from 'redux-saga/effects';

import { EDITOR_NOTE_NAME_CHANGED_ACTION } from './NoteDetailsActions';
import noteStorage from 'storage/noteStorage';

import { noteNameUpdateRequestSuccessAction } from 'components/NotesMindMap/NotesMindMapActions';

function* updateNoteName({ data: { note, newNoteName } }) {
  const newNote = yield noteStorage.updateNoteName({
    note,
    newName: newNoteName,
  });
  yield put(noteNameUpdateRequestSuccessAction(newNote));
}

export function* noteDetailsInit() {
  yield all([takeEvery(EDITOR_NOTE_NAME_CHANGED_ACTION, updateNoteName)]);
}
