import { all, call, put, takeEvery } from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import _ from 'underscore';

import {
  CHANGE_NOTE_VIS_NETWORK_NOTE_ACTION,
  changeNoteTextAction,
  changeSelectedNoteAction,
  REQUEST_NOTE_TEXT_ACTION
} from 'components/NotesMindMapView/NotesMindMapViewActions';
import noteStorage from 'storage/noteStorage';
import { APP_INIT_SUCCESS } from 'components/App/AppActions';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import { SEARCH_QUERY_CHANGED_ACTION } from 'components/SearchPanel/SearchPanelActions';
import googleDriveApi from 'api/google-drive-api';

const LOADING_NOTE_MESSAGE = 'loading note contents...';
let spinner = siteGlobalLoadingBar.create('mind map');

function* setRootNote() {
  yield put(changeSelectedNoteAction(noteStorage.getRoot()));
}

function* requestNoteText({ data }) {
  yield put(changeNoteTextAction(LOADING_NOTE_MESSAGE));
  const noteText = yield call(noteStorage.getNoteContent, data);
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

  put(changeSelectedNoteAction(targetNote));
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
  }
  catch (e) {
    throw Error(e);
  }
}

function renderChildren(children, targetNote, visNetwork) {
  visNetwork.addChildNotes({
    children,
    parentNoteId: targetNote.id
  });
}

function* searchNoteSaga({ data }) {
  const results = yield googleDriveApi.findNotesByName(data);
  console.log(results);
}


export function* noteMindMapInit() {
  yield all([
    takeEvery(APP_INIT_SUCCESS, setRootNote),
    takeEvery(REQUEST_NOTE_TEXT_ACTION, requestNoteText),
    takeEvery(CHANGE_NOTE_VIS_NETWORK_NOTE_ACTION, changeNote),
    takeEvery(SEARCH_QUERY_CHANGED_ACTION, searchNoteSaga),
  ]);
}
