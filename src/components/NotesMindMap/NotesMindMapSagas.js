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
  changeParentRequestSuccessAction,
  changeParentRequestFailAction,
  SEARCH_RESULT_CLICKED,
  INITIAL_NOTE_FETCHED_ACTION,
  CHANGE_PARENT_REQUEST_SUCCESS_ACTION,
  MIND_MAP_NODE_CLICKED_ACTION,
  MIND_MAP_NODE_DOUBLE_CLICKED_ACTION,
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
  noteFetchFailAction,
  newNoteParentSelectedAction,
  NEW_NOTE_PARENT_SELECTED_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';
import { NOTES_GRAPH_LOADED_FROM_LOCAL_STORAGE_ACTION } from 'components/NotesPage/NotesPageActions';
import { getParentNode, isNodeDecendantOf } from 'helpers/graph';
import { DISMISS_NOTE_IS_TRASHED_DIALOG_ACTION } from 'components/NotesMindMap/notifications/NoteIsTrashedDialog/NoteIsTrashedDialogActions';
import { NOTE_IS_PERMANENTLY_DELETED_DIALOG_CLOSED } from 'components/NotesMindMap/notifications/NoteIsPermanentlyDeletedDialog/NoteIsPermanentlyDeletedDialogActions';
import { editNoteAction } from 'components/NoteDetails/NoteDetailsActions.js';

function* handleInitialNoteLoad({ data: initialNote }) {
  yield put(noteFetchSuccessAction(initialNote));
}

function* handleSearchResultClick({ data: file }) {
  yield put(selectNoteAction(file));
  yield put(push('/notes'));
}

function* handleNewNoteParentSelected({ data: { graph, note, newParent } }) {
  if (note.id === newParent.id) {
    return;
  }

  if (getParentNode(graph, note).id === newParent.id) {
    return;
  }

  if (isNodeDecendantOf(graph, newParent, note)) {
    yield call(
      toast.warn,
      'New parent can not be a child of the selected note',
    );
    return;
  }

  yield put(
    changeParentNoteAction({
      note,
      newParent,
    }),
  );
}

function* changeParentNote({ data: { note, newParent } }) {
  try {
    yield apiCall(noteStorage.move, {
      noteId: note.id,
      newParentId: newParent.id,
    });
    yield put(changeParentRequestSuccessAction({ note, newParent }));
  } catch (error) {
    console.error(error);
    yield put(changeParentRequestFailAction({ note, newParent, error }));
    yield call(toast.error, 'Changing note parent has failed');
  }
}

function* handleChangeParentRequestSuccess({ data: { newParent } }) {
  yield put(push('/notes'));

  if (!newParent.wereChildrenFetched) {
    // fetch new parent together with its children to make sure the new note
    // is shown together with all the other children of its new parent
    yield put(fetchNoteAction(newParent));
  } else {
    console.log(
      'Not fetching new parent, as it was already fetched in this session',
    );
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
    } else {
      console.error(error);
      yield call(toast.error, 'Failed to load selected note');
      yield put(noteFetchFailAction(note));
    }
  }
}

function* handleMindMapNodeClick({
  data: { graph, targetNode, selectedNote, isChangeParentModeActive },
}) {
  if (isChangeParentModeActive) {
    yield put(
      newNoteParentSelectedAction({
        note: selectedNote,
        newParent: targetNode,
        graph,
      }),
    );
    return;
  }

  if (targetNode.isUploading) {
    yield put(push('/uploads'));
    return;
  }

  if (targetNode.id !== selectedNote.id) {
    yield put(selectNoteAction(targetNode));
  }
}

function* handleMindMapNodeDoubleClick({
  data: { targetNode, isChangeParentModeActive },
}) {
  if (!isChangeParentModeActive) {
    yield put(editNoteAction({ note: targetNode }));
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
    const children = yield apiCall(noteStorage.fetchChildNotes, fetchedNote);

    let parentNote;
    if (!noteStorage.isAppFolder(fetchedNote)) {
      parentNote = yield apiCall(noteStorage.fetchParentNote, fetchedNote);
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
    yield put(fetchNoteChildrenAndParentReqestFailAction(fetchedNote));
    yield call(toast.error, 'Failed to load note children and/or parent');
  }
}

function* handleNoteIsTrashedDialogDismiss({ data: { graph, note } }) {
  const parentNote = getParentNode(graph, note);
  yield put(selectNoteAction(parentNote));
}

function* handleNoteIsPermanentlyDeletedDialogDismiss({
  data: { graph, note },
}) {
  const parentNote = getParentNode(graph, note);
  yield put(selectNoteAction(parentNote));
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
    takeEvery(
      MIND_MAP_NODE_DOUBLE_CLICKED_ACTION,
      handleMindMapNodeDoubleClick,
    ),
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
    takeEvery(NEW_NOTE_PARENT_SELECTED_ACTION, handleNewNoteParentSelected),
  ]);
}
