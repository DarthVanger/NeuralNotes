import { connect } from 'react-redux';
import { makeAction } from 'redux-store';

import {
  NOTE_CHANGE_PARENT_ACTION,
  UPDATE_NOTE_NAME_ACTION,
  mindMapNodeClickedAction,
} from 'components/NotesMindMap/NotesMindMapActions';
import { NotesMindMapComponent } from 'components/NotesMindMap/NotesMindMapComponent';

import { addNoteButtonClickedAction } from 'components/BottomBar/BottomBarActions';

const mapStateToProps = ({
  notesMindMap: { selectedNote, isChangeParentModeActive, nodes, edges },
}) => ({
  selectedNote,
  isChangeParentModeActive,
  nodes,
  edges,
});

const mapDispatchToProps = dispatch => ({
  changeParentNote: data => makeAction(NOTE_CHANGE_PARENT_ACTION, data),
  updateNoteName: data => makeAction(UPDATE_NOTE_NAME_ACTION, data),
  mindMapNodeClicked: data => dispatch(mindMapNodeClickedAction(data)),
  addNoteButtonClicked: data => dispatch(addNoteButtonClickedAction(data)),
});

export const NotesMindMapContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotesMindMapComponent);
