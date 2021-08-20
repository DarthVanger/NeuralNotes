import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import {
  all,
  call,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import noteStorage from 'storage/noteStorage';
import { apiCall } from 'api/api';
import {
  noteWithChildrenAndParentFetchSuccessAction,
  NOTE_CHANGE_PARENT_ACTION,
  noteChildrenFetchedAction,
  selectedNoteParentFetchedAction,
  changeParentRequestSuccessAction,
  changeParentRequestFailAction,
  SEARCH_RESULT_CLICKED,
  INITIAL_NOTE_FETCHED_ACTION,
  CHANGE_PARENT_REQUEST_SUCCESS_ACTION,
  MIND_MAP_NODE_CLICKED_ACTION,
  FETCH_NOTE_ACTION,
  NOTE_FETCH_SUCCESS_ACTION,
  fetchNoteAction,
  noteFetchSuccessAction,
  FETCHED_NOTE_IS_TRASHED,
  fetchedNoteIsTrashed,
  selectNoteAction,
  SELECT_NOTE_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';
import { NOTES_GRAPH_LOADED_FROM_LOCAL_STORAGE_ACTION } from 'components/NotesPage/NotesPageActions';
import { doesNodeHasParent, getRootNode } from 'helpers/graph';
import {
  attemptToCallApiWithExpiredTokenAction,
  SESSION_REFRESH_SUCCESS_ACTION,
  ATTEMPT_TO_CALL_API_WITH_EXPIRED_TOKEN_ACTION,
  sesssionRefreshSuccessAction,
} from 'components/LoginPage/LoginPageActions';
import { DISMISS_NOTE_IS_TRASHED_DIALOG_ACTION } from 'components/NotesMindMap/NoteIsTrashedDialog/NoteIsTrashedDialogActions';

function* handleInitialNoteLoad({ data: initialNote }) {
  yield put(noteFetchSuccessAction(initialNote));
}

function* handleSearchResultClick({ data: { note } }) {
  const targetNote = note;
  const childNotes = yield fetchChildNotes(targetNote);
  yield put(push('/notes'));
  yield put(noteChildrenFetchedAction({ note, children }));
}

function* fetchChildNotes(note) {
  try {
    const childNotes = yield apiCall(noteStorage.fetchChildNotes, note);
    return childNotes;
  } catch (e) {
    yield call([toast, toast.error], e);
  }
}

function* fetchParentNote(note) {
  console.info(`Loading parent note for "${note.name}"...`);
  try {
    const parentNote = yield apiCall(noteStorage.fetchParentNote, note);
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
    yield apiCall(noteStorage.move, {
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

function* handleNotesGraphLoadedFromLocalStorage({ data: { selectedNote } }) {
  yield put(selectNoteAction(selectedNote));
}

function* fetchNote({ data: note }) {
  const fetchedNote = yield apiCall(noteStorage.getNoteById, note.id);
  yield put(noteFetchSuccessAction(fetchedNote));
}

function* handleMindMapNodeClick({
  data: { targetNode, graph, selectedNote, isChangeParentModeActive },
}) {
  if (targetNode.id === selectedNote.id) return;

  if (isChangeParentModeActive) {
    yield put(
      changeParentNoteAction({
        note: selectedNote,
        newParent: targetNote,
      }),
    );
  } else {
    yield put(selectNoteAction(targetNode));
  }
}

function* handleSelectNote({ data: note }) {
  yield put(fetchNoteAction(note));
}

function* handleFetchNoteSuccess({ data: fetchedNote }) {
  if (fetchedNote.trashed) {
    yield put(fetchedNoteIsTrashed(fetchedNote));
    return;
  }

  const children = yield fetchChildNotes(fetchedNote);

  let parentNote;
  if (!noteStorage.isAppFolder(fetchedNote)) {
    parentNote = yield fetchParentNote(fetchedNote);
  }

  yield put(
    noteWithChildrenAndParentFetchSuccessAction({
      note: fetchedNote,
      children,
      parentNote,
    }),
  );
}

function* handleTrashedNoteFetch({ data: fetchedNote }) {
  console.log('fetched trashed note: ', fetchedNote);
}

function* handleNoteIsTrashedDialogDismiss({ data: { graph } }) {
  const rootNote = getRootNode(graph);
  yield put(selectNoteAction(rootNote));
}

export function* noteMindMapInit() {
  yield all([
    takeEvery(NOTE_CHANGE_PARENT_ACTION, changeParentNote),
    takeEvery(
      CHANGE_PARENT_REQUEST_SUCCESS_ACTION,
      handleChangeParentRequestSuccess,
    ),
    takeEvery(INITIAL_NOTE_FETCHED_ACTION, handleInitialNoteLoad),
    takeEvery(SEARCH_RESULT_CLICKED, handleSearchResultClick),
    takeEvery(
      NOTES_GRAPH_LOADED_FROM_LOCAL_STORAGE_ACTION,
      handleNotesGraphLoadedFromLocalStorage,
    ),
    takeEvery(MIND_MAP_NODE_CLICKED_ACTION, handleMindMapNodeClick),
    takeEvery(FETCH_NOTE_ACTION, fetchNote),
    takeEvery(NOTE_FETCH_SUCCESS_ACTION, handleFetchNoteSuccess),
    takeEvery(FETCHED_NOTE_IS_TRASHED, handleTrashedNoteFetch),
    takeEvery(
      DISMISS_NOTE_IS_TRASHED_DIALOG_ACTION,
      handleNoteIsTrashedDialogDismiss,
    ),
    takeEvery(SELECT_NOTE_ACTION, handleSelectNote),
  ]);
}
