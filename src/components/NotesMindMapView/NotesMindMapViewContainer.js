import { connect } from 'react-redux';
import { action } from 'sagas';

import {
  CHANGE_SELECTED_NOTE_ACTION,
  REQUEST_NOTE_TEXT_ACTION
} from 'components/NotesMindMapView/NotesMindMapViewActions';
import { NotesMindMapViewComponent } from 'components/NotesMindMapView/NotesMindMapViewComponent';

const mapStateToProps = ({ notesMindMap: { selectedNote } }) => {
  return {
    selectedNote
  }
};

const mapDispatchToProps = () => ({
  requestNoteText: data => action(REQUEST_NOTE_TEXT_ACTION, data),
  changeSelectedNote: data => action(CHANGE_SELECTED_NOTE_ACTION, data),
});

export const NotesMindMapViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotesMindMapViewComponent);
