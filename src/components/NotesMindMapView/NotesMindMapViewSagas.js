import { all, call, put, takeEvery } from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import { toast } from 'react-toastify';
import _ from 'underscore';

import {
  CHANGE_NOTE_VIS_NETWORK_NOTE_ACTION,
  changeNoteTextAction,
  changeSelectedNoteAction,
  CREATE_EMPTY_CHILD,
  DELETE_NOTE,
  NOTE_CHANGE_PARENT_ACTION,
  SWITCH_CHANGE_PARENT_MODE_ACTION
} from 'components/NotesMindMapView/NotesMindMapViewActions';
import noteStorage from 'storage/noteStorage';
import { APP_INIT_SUCCESS } from 'components/App/AppActions';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';

const LOADING_NOTE_MESSAGE = 'loading note contents...';
let spinner = siteGlobalLoadingBar.create('mind map');

function* setRootNote() {
  yield put(changeSelectedNoteAction(noteStorage.getRoot()));
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
function* changeNote({ data: { targetNote, visNetwork } }) {
  if (!_.isEmpty(targetNote.children)) {
    renderChildren(targetNote.children, targetNote, visNetwork);
  } else {
    const childNote = yield fetchChildNotes(targetNote);
    renderChildren(childNote, targetNote, visNetwork);
  }

  yield put(changeSelectedNoteAction(targetNote));
  if (targetNote.isNote) {
    yield requestNoteText(targetNote);
  }

  if (targetNote.parent) {
    if (!_.isEmpty(targetNote.parent.name)) {
      visNetwork.renderParentNote(targetNote);
    } else {
      targetNote.parent = yield fetchParentNote(targetNote.id);
      visNetwork.renderParentNote(targetNote);
    }
  }
}

function* fetchParentNote(noteId) {
  const fetchingParentNote = spinner.create('loading parent note');
  const parentNote = yield noteStorage.fetchParentNote(noteId);
  fetchingParentNote.hide();
  return parentNote;
}

function* fetchChildNotes(note) {
  const fetchingNotesSpinner = spinner.create('loading child notes');
  fetchingNotesSpinner.show();
  try {
    const childNote = yield noteStorage.fetchChildNotes(note);
    fetchingNotesSpinner.hide();
    return childNote;
  } catch (e) {
    yield call([toast, toast.error], e);
  }
}

function renderChildren(children, targetNote, visNetwork) {
  visNetwork.addChildNotes({
    children,
    parentNoteId: targetNote.id
  });
}

function createEmptyChild({ data: { parentId, visNetwork } }) {
  const note = {
    name: 'new2',
    content: '',
    isNote: true
  };

  const parent = noteStorage.findNoteById(parentId);

  return noteStorage.create(note, parent)
    .then(newNote => {
      note.id = newNote.id;

      const children = [note];

      noteStorage.addChildrenToTree({
        parentId: parentId,
        children,
      });

      visNetwork.addChildNotes({
        children,
        parentNoteId: parentId,
      });

      this.editNote(note.id);

      return note;
    });
}

function deleteNote({ data: { note, visNetwork } }) {
  noteStorage.remove(note)
    .then(function () {
      visNetwork.deleteSelectedNode();
    });
}

function* changeParentNote({ data: { noteId, newParentId } }) {
  try {
    yield noteStorage.move({ noteId, newParentId });
    yield put({ type: SWITCH_CHANGE_PARENT_MODE_ACTION, data: { isActive: false } });
    yield call([toast, toast.error], 'tree re-rendering is not implemented yet');
  } catch (e) {
    yield put({ type: SWITCH_CHANGE_PARENT_MODE_ACTION, data: { isActive: false } });
    throw Error(e);
  }
}

export function* noteMindMapInit() {
  yield all([
    takeEvery(APP_INIT_SUCCESS, setRootNote),
    takeEvery(CHANGE_NOTE_VIS_NETWORK_NOTE_ACTION, changeNote),
    takeEvery(CREATE_EMPTY_CHILD, createEmptyChild),
    takeEvery(DELETE_NOTE, deleteNote),
    takeEvery(NOTE_CHANGE_PARENT_ACTION, changeParentNote),
  ]);
}
