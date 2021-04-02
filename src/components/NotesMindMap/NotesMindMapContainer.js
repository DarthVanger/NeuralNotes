import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { action } from 'sagas';
import { UploadsSelectors } from 'selectors';

import {
  CHANGE_SELECTED_NOTE_ACTION,
  NOTE_CHANGE_PARENT_ACTION,
  ADD_NOTE_BUTTON_CLICKED_ACTION,
  UPDATE_NOTE_NAME_ACTION,
  MIND_MAP_CLICKED_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';
import { NotesMindMapComponent } from 'components/NotesMindMap/NotesMindMapComponent';

const getNotesMindMapState = state => state.notesMindMap;

const createNotesMindMapPropertySelector = property =>
  createSelector(
    getNotesMindMapState,
    notesMindMapState => notesMindMapState[property],
  );

const mapStateToProps = createStructuredSelector({
  selectedNote: createNotesMindMapPropertySelector('selectedNote'),
  isChangeParentModeActive: createNotesMindMapPropertySelector(
    'isChangeParentModeActive',
  ),
  nodes: createNotesMindMapPropertySelector('nodes'),
  edges: createNotesMindMapPropertySelector('edges'),
});

const mapDispatchToProps = () => ({
  changeSelectedNote: data => action(CHANGE_SELECTED_NOTE_ACTION, data),
  changeParentNote: data => action(NOTE_CHANGE_PARENT_ACTION, data),
  createEmptyChild: data => action(ADD_NOTE_BUTTON_CLICKED_ACTION, data),
  updateNoteName: data => action(UPDATE_NOTE_NAME_ACTION, data),
  onMindMapClick: data => action(MIND_MAP_CLICKED_ACTION, data),
});

export const NotesMindMapContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotesMindMapComponent);
