import { connect } from 'react-redux';
import { makeAction } from 'redux-store';

import {
  CHANGE_SELECTED_NOTE_ACTION,
  NOTE_CHANGE_PARENT_ACTION,
  UPDATE_NOTE_NAME_ACTION,
  MIND_MAP_CLICKED_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';
import { NotesMindMapComponent } from 'components/NotesMindMap/NotesMindMapComponent';

const mapStateToProps = ({
  notesMindMap: { selectedNote, isChangeParentModeActive, nodes, edges },
}) => ({
  selectedNote,
  isChangeParentModeActive,
  nodes,
  edges,
});

const mapDispatchToProps = () => ({
  changeSelectedNote: data => makeAction(CHANGE_SELECTED_NOTE_ACTION, data),
  changeParentNote: data => makeAction(NOTE_CHANGE_PARENT_ACTION, data),
  updateNoteName: data => makeAction(UPDATE_NOTE_NAME_ACTION, data),
  onMindMapClick: data => makeAction(MIND_MAP_CLICKED_ACTION, data),
});

export const NotesMindMapContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotesMindMapComponent);
