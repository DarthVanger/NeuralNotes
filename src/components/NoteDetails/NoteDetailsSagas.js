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

/**
 * The same note editor is used both for existing notes and for creating a new note.
 *
 * If the editor was opened to create a new note, it is created after the first change.
 * If any changes are made while note creation is in progress, the changes are queued,
 * and applied automatically after note creation success.
 * If note is an existing one, simply send request to update it.
 */
const shouldUpdateNote = editorState => editorState.isExistingNote;
const shouldCreateNote = editorState =>
  !editorState.isExistingNote && !editorState.isNoteCreationInProgress;
const shouldQueueUpdate = editorState => editorState.isNoteCreationInProgress;

/**
 * Changes made while the note is being created in Google Drive
 * are queued, and appplied as soon as the note has been created.
 *
 * This is to avoid blocking the UI while the http request to create
 * the note in Google Drive is pending.
 */
const queuedChanges = {
  noteName: null,
  noteContent: null,
};

function* handleNoteNameChange({ data: { note, newNoteName, editorState } }) {
  if (shouldUpdateNote(editorState)) yield updateNoteName();
  if (shouldCreateNote(editorState)) yield createNote();
  if (shouldQueueUpdate(editorState)) queueUpdate();

  function createNote() {
    return put(
      createNoteRequestAction({
        name: newNoteName,
        content: '',
        parent: note,
      }),
    );
  }

  function queueUpdate() {
    queuedChanges.noteName = newNoteName;
    console.debug('Queued changes for note name:', queuedChanges);
  }

  function updateNoteName() {
    return put(
      noteNameUpdateRequestAction({
        ...note,
        name: newNoteName,
      }),
    );
  }
}

function* handleNoteContentChange({
  data: { note, noteContent, editorState },
}) {
  if (shouldUpdateNote(editorState)) yield updateNoteName();
  if (shouldCreateNote(editorState)) yield createNote();
  if (shouldQueueUpdate(editorState)) queueUpdate();

  function createNote() {
    return put(
      createNoteRequestAction({
        name: 'Untitled note',
        content: noteContent,
        parent: note,
      }),
    );
  }

  function queueUpdate() {
    queuedChanges.noteContent = noteContent;
    console.debug('Queued changes for note content:', queuedChanges);
  }

  function updateNoteName() {
    return put(
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
    console.debug(
      `Applying queued changes for note name: "${queuedChanges.noteName}"`,
    );
    yield put(
      noteNameUpdateRequestAction({
        ...newNote,
        name: queuedChanges.noteName,
      }),
    );
    queuedChanges.noteName = null;
  }
  if (queuedChanges.noteContent !== null) {
    console.debug(
      `Applying queued changes for note content: "${queuedChanges.noteContent}"`,
    );
    yield put(
      noteContentUpdateRequestAction({
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
  yield all([
    takeEvery(EDITOR_NOTE_NAME_CHANGED_ACTION, handleNoteNameChange),
    takeEvery(EDITOR_NOTE_CONTENT_CHANGED_ACTION, handleNoteContentChange),
    takeEvery(NOTE_NAME_UPDATE_REQUEST, requestNoteNameUpdate),
    takeEvery(NOTE_CONTENT_UPDATE_REQUEST, requestNoteContentUpdate),
    takeEvery(CREATE_NOTE_REQUEST_ACTION, createNoteRequest),
    takeEvery(EDIT_NOTE_BUTTON_CLICKED_ACTION, handleEditNoteButtonClick),
  ]);
}
