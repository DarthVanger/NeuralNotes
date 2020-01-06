import { connect } from 'react-redux';
import { action } from 'sagas';

import {
  CHANGE_SELECTED_NOTE_ACTION,
  NOTE_CHANGE_PARENT_ACTION,
  DELETE_NOTE_ACTION,
  CREATE_EMPTY_CHILD_ACTION,
  EDIT_NOTE_NAME_ACTION,
  UPDATE_NOTE_NAME_ACTION,
  MIND_MAP_CLICKED_ACTION,
  CHANGE_PARENT_BUTTON_CLICKED_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';
import { NotesMindMapComponent } from 'components/NotesMindMap/NotesMindMapComponent';

const mapStateToProps = ({ notesMindMap: { rootNote, selectedNote, noteText, showNoteNameEditor, isChangeParentModeActive, nodes, edges } }) => {
  return {
    selectedNote,
    showNoteNameEditor,
    noteText,
    rootNote,
    nodes,
    edges,
    isChangeParentModeActive,
  }
};

const mapDispatchToProps = () => ({
  changeSelectedNote: data => action(CHANGE_SELECTED_NOTE_ACTION, data),
  changeParentNote: data => action(NOTE_CHANGE_PARENT_ACTION, data),
  createEmptyChild: data => action(CREATE_EMPTY_CHILD_ACTION, data),
  deleteNote: data => action(DELETE_NOTE_ACTION, data),
  editNote: data => action(EDIT_NOTE_NAME_ACTION, data),
  updateNoteName: data => action(UPDATE_NOTE_NAME_ACTION, data),
  onMindMapClick: data => action(MIND_MAP_CLICKED_ACTION, data),
  onChangeParentButtonClick: data => action(CHANGE_PARENT_BUTTON_CLICKED_ACTION, data),
});

export const NotesMindMapContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotesMindMapComponent);
