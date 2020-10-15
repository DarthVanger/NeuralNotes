import {
  all,
  call,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import { toast } from 'react-toastify';

import {
  CHANGE_SELECTED_NOTE_ACTION,
  changeNoteTextAction,
  changeSelectedNoteAction,
  NOTE_CHANGE_PARENT_ACTION,
  selectedNoteChildrenFetchedAction,
  CREATE_EMPTY_CHILD_ACTION,
  DELETE_NOTE_ACTION,
  UPDATE_NOTE_NAME_ACTION,
  noteNameUpdateRequestSuccessAction,
  createNoteSuccessAction,
  editNoteNameAction,
  deleteNoteRequestSuccessAction,
  changeParentRequestSuccessAction,
  changeParentRequestFailAction,
  SEARCH_RESULT_CLICKED,
} from 'components/NotesMindMap/NotesMindMapActions';
import noteStorage from 'storage/noteStorage';
import { ROOT_NOTE_FOUND_ACTION } from 'components/App/AppActions';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import { UploadsActions } from 'components/Uploads/UploadsActions';
import { setPageAction } from 'components/App/AppSagas';
import { PAGES_ENUM } from 'components/App/AppConstants';

const LOADING_NOTE_MESSAGE = 'loading note contents...';
let spinner = siteGlobalLoadingBar.create('mind map');

function* selectRootNote({ data }) {
  yield put(changeSelectedNoteAction({ note: data, edges: [] }));
}

function* requestNoteText(note) {
  yield put(changeNoteTextAction(LOADING_NOTE_MESSAGE));
  const noteText = yield call(noteStorage.getNoteContent, note);
  yield put(changeNoteTextAction(noteText));
}

/**
 * Load child notes for clicked note,
 * and redraw the network for new notes.
 */
function* changeSelectedNote({ data: { note, edges } }) {
  const targetNote = note;
  if (didNotAttemptToFetchChildren(targetNote, edges)) {
    const childNotes = yield fetchChildNotes(targetNote);
    yield put(selectedNoteChildrenFetchedAction(childNotes));
  } else {
    console.log('not fetching child notes');
  }

  if (targetNote.isNote) {
    yield requestNoteText(targetNote);
  }
}

function* handleSearchResultClick({ data: { note } }) {
  const targetNote = note;
  localStorage.setItem('lastViewedNoteId', targetNote.id);
  const childNotes = yield fetchChildNotes(targetNote);
  yield setPageAction(PAGES_ENUM.NOTES);
  yield put(selectedNoteChildrenFetchedAction(childNotes));

  if (targetNote.isNote) {
    yield requestNoteText(targetNote);
  }
}

function* fetchChildNotes(note) {
  const fetchingNotesSpinner = spinner.create('loading child notes');
  fetchingNotesSpinner.show();
  try {
    const childNotes = yield call(noteStorage.fetchChildNotes, note);
    fetchingNotesSpinner.hide();
    return childNotes;
  } catch (e) {
    yield call([toast, toast.error], e);
  }
}

function* createEmptyChild({ data: { parent } }) {
  const note = {
    name: 'new2',
    content: '',
    isNote: true,
  };

  const newNote = yield noteStorage.create(note, parent);
  newNote.parent = parent;
  yield put(createNoteSuccessAction(newNote));
  yield put(editNoteNameAction(newNote));
}

function* deleteNote({ data: { note } }) {
  yield noteStorage.remove(note);
  yield put(deleteNoteRequestSuccessAction(note));
}

function* updateNoteName({ data: { note, newName } }) {
  const newNote = yield noteStorage.updateNoteName({ note, newName });
  yield put(noteNameUpdateRequestSuccessAction(newNote));
}

function* changeParentNote({ data: { noteId, newParent, edges } }) {
  try {
    if (didNotAttemptToFetchChildren(newParent, edges)) {
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

function didNotAttemptToFetchChildren(note, edges) {
  return !(edges
    ? edges.filter(edge => edge.from === note.id).length > 0
    : false);
}

function* uploadSuccessSaga(action) {
  const { uploadFolderId } = action.payload.file;

  // @todo: need to refresh notes for `uploadFolderId`
  yield call(() => console.log('Need to refresh children for', uploadFolderId));
}

export function* noteMindMapInit() {
  yield all([
    takeEvery(NOTE_CHANGE_PARENT_ACTION, changeParentNote),
    takeEvery(ROOT_NOTE_FOUND_ACTION, selectRootNote),
    takeEvery(CHANGE_SELECTED_NOTE_ACTION, changeSelectedNote),
    takeEvery(CREATE_EMPTY_CHILD_ACTION, createEmptyChild),
    takeEvery(DELETE_NOTE_ACTION, deleteNote),
    takeEvery(UPDATE_NOTE_NAME_ACTION, updateNoteName),
    takeEvery(SEARCH_RESULT_CLICKED, handleSearchResultClick),
    takeEvery(UploadsActions.file.uploadSuccess, uploadSuccessSaga),
  ]);
}
