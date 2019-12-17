import { connect } from 'react-redux';
import { action } from 'sagas';

import {
  CHANGE_NOTE_VIS_NETWORK_NOTE_ACTION,
  CHANGE_SELECTED_NOTE_ACTION,
  CREATE_EMPTY_CHILD,
  DELETE_NOTE,
  NOTE_CHANGE_PARENT_ACTION,
  SWITCH_CHANGE_PARENT_MODE_ACTION,
} from 'components/NotesMindMapView/NotesMindMapViewActions';
import { NotesMindMapViewComponent } from 'components/NotesMindMapView/NotesMindMapViewComponent';

const mapStateToProps = ({ notesMindMap: { selectedNote, isChangeParentModeActive } }) => {
  return {
    selectedNote, isChangeParentModeActive
  }
};

const mapDispatchToProps = () => ({
  changeSelectedNote: data => action(CHANGE_SELECTED_NOTE_ACTION, data),
  changeVisNetworkNote: data => action(CHANGE_NOTE_VIS_NETWORK_NOTE_ACTION, data),
  createEmptyChild: data => action(CREATE_EMPTY_CHILD, data),
  deleteNote: data => action(DELETE_NOTE, data),
  changeParentNote: data => action(NOTE_CHANGE_PARENT_ACTION, data),
  switchChangeParentMode: data => action(SWITCH_CHANGE_PARENT_MODE_ACTION, data),
});

export const NotesMindMapViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotesMindMapViewComponent);
