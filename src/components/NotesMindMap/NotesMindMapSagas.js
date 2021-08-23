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
  fetchedNoteIsTrashed,
  selectNoteAction,
  SELECT_NOTE_ACTION,
  fetchedNoteNotFoundAction,
  changeParentNoteAction,
  fetchNoteChildrenAndParentReqestFailAction,
} from 'components/NotesMindMap/NotesMindMapActions';
import { NOTES_GRAPH_LOADED_FROM_LOCAL_STORAGE_ACTION } from 'components/NotesPage/NotesPageActions';
import { getRootNode } from 'helpers/graph';
import { DISMISS_NOTE_IS_TRASHED_DIALOG_ACTION } from 'components/NotesMindMap/notifications/NoteIsTrashedDialog/NoteIsTrashedDialogActions';
import { NOTE_IS_PERMANENTLY_DELETED_DIALOG_CLOSED } from 'components/NotesMindMap/notifications/NoteIsPermanentlyDeletedDialog/NoteIsPermanentlyDeletedDialogActions';

function* handleInitialNoteLoad({ data: initialNote }) {
  yield put(noteFetchSuccessAction(initialNote));
}

function* handleSearchResultClick({ data: { note } }) {
  const children = yield fetchChildNotes(note);
  yield put(push('/notes'));
  yield put(noteChildrenFetchedAction({ note, children }));
}

function* fetchChildNotes(note) {
  const childNotes = yield apiCall(noteStorage.fetchChildNotes, note);
  return childNotes;
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
  yield put(
    selectNoteAction({
      ...selectedNote,
      wereChildrenFetched: false,
    }),
  );
}

function* fetchNote({ data: note }) {
  try {
    const fetchedNote = yield apiCall(noteStorage.getNoteById, note.id);
    yield put(noteFetchSuccessAction(fetchedNote));
  } catch (error) {
    if (error.code === 404) {
      yield put(fetchedNoteNotFoundAction(note));
    }
  }
}

function* handleMindMapNodeClick({
  data: { targetNode, selectedNote, isChangeParentModeActive },
}) {
  if (targetNode.id === selectedNote.id) return;

  if (isChangeParentModeActive) {
    yield put(
      changeParentNoteAction({
        note: selectedNote,
        newParent: targetNode,
      }),
    );
  } else {
    yield put(selectNoteAction(targetNode));
  }
}

function* handleSelectNote({ data: note }) {
  if (note.wereChildrenFetched) {
    console.info(
      `Not fetching selected note "${note.name}", as it was already fetched during this session`,
    );
    return;
  }
  yield put(fetchNoteAction(note));
}

function* handleFetchNoteSuccess({ data: fetchedNote }) {
  if (fetchedNote.trashed) {
    yield put(fetchedNoteIsTrashed(fetchedNote));
    return;
  }

  try {
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
  } catch (error) {
    console.error(error);
    yield put(fetchNoteChildrenAndParentReqestFailAction());
    yield call(toast.error, 'Failed to load note children');
  }
}

function* handleNoteIsTrashedDialogDismiss({ data: { graph } }) {
  const rootNote = getRootNode(graph);
  yield put(selectNoteAction(rootNote));
}

function* handleNoteIsPermanentlyDeletedDialogDismiss({ data: { graph } }) {
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
    takeEvery(
      DISMISS_NOTE_IS_TRASHED_DIALOG_ACTION,
      handleNoteIsTrashedDialogDismiss,
    ),
    takeEvery(
      NOTE_IS_PERMANENTLY_DELETED_DIALOG_CLOSED,
      handleNoteIsPermanentlyDeletedDialogDismiss,
    ),
    takeEvery(SELECT_NOTE_ACTION, handleSelectNote),
  ]);
}
