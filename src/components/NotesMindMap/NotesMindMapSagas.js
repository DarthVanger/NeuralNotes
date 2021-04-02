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
  selectedNoteChildrenFetchedAction,
  selectedNoteParentFetchedAction,
  changeParentRequestSuccessAction,
  changeParentRequestFailAction,
  SEARCH_RESULT_CLICKED,
  ROOT_NOTE_FOUND_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';
import { doesNodeHasParent } from 'helpers/graph';

function* selectRootNote({ data }) {
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
    const childNotes = yield fetchChildNotes(targetNote);
    yield put(selectedNoteChildrenFetchedAction(childNotes));
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
  yield put(selectedNoteChildrenFetchedAction(childNotes));
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

function* changeParentNote({ data: { noteId, newParent } }) {
  try {
    if (newParent.wereChildrenFetched) {
      yield* fetchChildNotes(newParent);
    }
    yield call(noteStorage.move, { noteId, newParentId: newParent.id });
    yield put(
      changeParentRequestSuccessAction({ noteId, newParentId: newParent.id }),
    );
  } catch (e) {
    yield put(
      changeParentRequestFailAction({ noteId, newParentId: newParent.id }),
    );
    yield call([toast, toast.error], 'Changing note has parent failed');
    throw Error(e);
  }
}

export function* noteMindMapInit() {
  yield all([
    takeEvery(NOTE_CHANGE_PARENT_ACTION, changeParentNote),
    takeEvery(ROOT_NOTE_FOUND_ACTION, selectRootNote),
    takeEvery(CHANGE_SELECTED_NOTE_ACTION, changeSelectedNote),
    takeEvery(SEARCH_RESULT_CLICKED, handleSearchResultClick),
  ]);
}
