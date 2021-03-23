import { toast } from 'react-toastify';
import { all, takeEvery, put, call } from 'redux-saga/effects';
import noteStorage from 'storage/noteStorage';
import { EDIT_NOTE_BUTTON_CLICKED_ACTION } from 'components/BottomBar/BottomBarActions';
import {
  EDITOR_NOTE_NAME_CHANGED_ACTION,
  EDITOR_NOTE_CONTENT_CHANGED_ACTION,
  NOTE_NAME_UPDATE_REQUEST,
  NOTE_CONTENT_UPDATE_REQUEST,
  CREATE_NOTE_REQUEST_ACTION,
  createNoteRequestAction,
  noteNameUpdateRequestSuccessAction,
  noteContentUpdateRequestSuccessAction,
  noteContentFetchSuccessAction,
  noteNameUpdateRequestAction,
  noteContentUpdateRequestAction,
  createNoteSuccessAction,
} from './NoteDetailsActions';
import { push } from 'connected-react-router';

const queuedChanges = {
  noteName: null,
  noteContent: null,
};

function* handleNoteNameChange({
  data: { note, newNoteName, isNewNote, isNoteCreationInProgress },
}) {
  if (isNewNote) {
    if (!isNoteCreationInProgress) {
      yield put(
        createNoteRequestAction({
          name: newNoteName,
          content: '',
          parent: note,
        }),
      );
    } else {
      queuedChanges.noteName = newNoteName;
    }
  } else {
    yield put(
      noteNameUpdateRequestAction({
        ...note,
        name: newNoteName,
      }),
    );
  }
}

function* handleNoteContentChange({
  data: { note, noteContent, isNewNote, isNoteCreationInProgress },
}) {
  if (isNewNote) {
    if (!isNoteCreationInProgress) {
      yield put(
        createNoteRequestAction({
          name: 'Untitled note',
          content: noteContent,
          parent: note,
        }),
      );
    } else {
      queuedChanges.noteName = newNoteName;
    }
  } else {
    yield put(
      noteContentUpdateRequestAction({
        ...note,
        content: noteContent,
      }),
    );
  }
}

function* requestNoteNameUpdate({ data: { note } }) {
  const newNote = yield noteStorage.updateNoteName({
    note,
    newName: note.name,
  });
  yield put(noteNameUpdateRequestSuccessAction(newNote));
}

function* requestNoteContentUpdate({ data: { note } }) {
  try {
    const newNote = yield noteStorage.updateNoteContent(note);
    yield put(noteContentUpdateRequestSuccessAction(newNote));
  } catch (error) {
    toast.error('Failed to save note content');
    console.error(error);
  }
}

function* createNoteRequest({ data: { note } }) {
  const newNote = yield noteStorage.create(note);
  newNote.parent = note.parent;
  yield put(createNoteSuccessAction(newNote));

  if (queuedChanges.noteName !== null) {
    yield put(
      noteNameUpdateRequestAction({
        ...newNote,
        name: queuedChanges.noteName,
      }),
    );
    queuedChanges.noteName = null;
  }
  if (queuedChanges.noteContent !== null) {
    yield put(
      noteNameUpdateRequestAction({
        ...newNote,
        content: queuedChanges.noteContent,
      }),
    );
    queuedChanges.noteContent = null;
  }
}

function* handleEditNoteButtonClick({ data: { note } }) {
  yield put(push(`/note/${note.id}`));
  const noteContent = yield call(noteStorage.getNoteContent, note);
  yield put(noteContentFetchSuccessAction(noteContent));
}

function* handleCreateNoteSuccess({ data: note }) {
  if (queuedChanges.queued) {
    yield put(applyQueuedNoteUpdates(queuedChanges));
    const newNote = yield noteStorage.updateNoteName({
      note,
      newName: newNoteName,
    });
    yield put(noteNameUpdateRequestSuccessAction(newNote));
  }
}

export function* noteDetailsInit() {
  yield all([takeEvery(EDITOR_NOTE_NAME_CHANGED_ACTION, handleNoteNameChange)]);
  yield all([
    takeEvery(EDITOR_NOTE_CONTENT_CHANGED_ACTION, handleNoteContentChange),
  ]);
  yield all([takeEvery(NOTE_NAME_UPDATE_REQUEST, requestNoteNameUpdate)]);
  yield all([takeEvery(NOTE_CONTENT_UPDATE_REQUEST, requestNoteContentUpdate)]);
  yield all([takeEvery(CREATE_NOTE_REQUEST_ACTION, createNoteRequest)]);
  yield all([
    takeEvery(EDIT_NOTE_BUTTON_CLICKED_ACTION, handleEditNoteButtonClick),
  ]);
}
