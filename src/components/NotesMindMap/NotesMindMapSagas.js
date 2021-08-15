import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import {
  all,
  call,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import noteStorage from 'storage/noteStorage';
import {
  CHANGE_SELECTED_NOTE_ACTION,
  changeSelectedNoteAction,
  NOTE_CHANGE_PARENT_ACTION,
  noteChildrenFetchedAction,
  selectedNoteParentFetchedAction,
  changeParentRequestSuccessAction,
  changeParentRequestFailAction,
  SEARCH_RESULT_CLICKED,
  INITIAL_NOTE_FETCHED_ACTION,
  CHANGE_PARENT_REQUEST_SUCCESS_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';
import { doesNodeHasParent } from 'helpers/graph';

function* handleInitialNoteLoad({ data }) {
  yield put(changeSelectedNoteAction({ note: data, edges: [] }));
}

/**
 * Load child notes for clicked note,
 * and redraw the network for new notes.
 */
function* changeSelectedNote({ data: { note, edges } }) {
  const targetNote = note;
  localStorage.setItem('lastViewedNoteId', targetNote.id);
  if (!targetNote.wereChildrenFetched && !targetNote.isUploadedFile) {
    const children = yield fetchChildNotes(targetNote);
    yield put(noteChildrenFetchedAction({ note, children }));
  } else {
    console.log('not fetching child notes');
  }

  if (!doesNodeHasParent(note, edges) && !noteStorage.isAppFolder(note)) {
    const parentNote = yield fetchParentNote(targetNote);
    yield put(selectedNoteParentFetchedAction(parentNote));
  } else {
    console.log('not fetching parent note');
  }
}

function* handleSearchResultClick({ data: { note } }) {
  const targetNote = note;
  localStorage.setItem('lastViewedNoteId', targetNote.id);
  const childNotes = yield fetchChildNotes(targetNote);
  yield put(push('/notes'));
  yield put(noteChildrenFetchedAction({ note, children }));
}

function* fetchChildNotes(note) {
  try {
    const childNotes = yield call(noteStorage.fetchChildNotes, note);
    return childNotes;
  } catch (e) {
    yield call([toast, toast.error], e);
  }
}

function* fetchParentNote(note) {
  console.info(`Loading parent note for "${note.name}"...`);
  try {
    const parentNote = yield call(noteStorage.fetchParentNote, note);
    console.info(
      `[Loaded] Parent note for "${note.name}": "${parentNote.name}"`,
    );
    return parentNote;
  } catch (e) {
    yield call([toast, toast.error], 'Someting went wrong :(');
    throw e;
  }
}

function* changeParentNote({ data: { note, newParent } }) {
  try {
    if (newParent.wereChildrenFetched) {
      yield* fetchChildNotes(newParent);
    }
    yield call(noteStorage.move, {
      noteId: note.id,
      newParentId: newParent.id,
    });
    yield put(changeParentRequestSuccessAction({ note, newParent }));
  } catch (e) {
    yield put(changeParentRequestFailAction({ note, newParent, error: e }));
    yield call([toast, toast.error], 'Changing note has parent failed');
    throw Error(e);
  }
}

function* handleChangeParentRequestSuccess({ data: { note, newParent } }) {
  yield put(push('/notes'));

  if (!newParent.wereChildrenFetched) {
    const children = yield fetchChildNotes(newParent);
    yield put(noteChildrenFetchedAction({ note, children }));
  } else {
    console.log('not fetching child notes for new parent');
  }
}

export function* noteMindMapInit() {
  yield all([
    takeEvery(NOTE_CHANGE_PARENT_ACTION, changeParentNote),
    takeEvery(
      CHANGE_PARENT_REQUEST_SUCCESS_ACTION,
      handleChangeParentRequestSuccess,
    ),
    takeEvery(INITIAL_NOTE_FETCHED_ACTION, handleInitialNoteLoad),
    takeEvery(CHANGE_SELECTED_NOTE_ACTION, changeSelectedNote),
    takeEvery(SEARCH_RESULT_CLICKED, handleSearchResultClick),
  ]);
}
