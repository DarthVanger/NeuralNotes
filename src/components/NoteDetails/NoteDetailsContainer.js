import { connect } from 'react-redux';

import {
  EDITOR_NOTE_NAME_CHANGED_ACTION,
  EDITOR_NOTE_CONTENT_CHANGED_ACTION,
} from 'components/NoteDetails/NoteDetailsActions';
import { NoteDetailsComponent } from 'components/NoteDetails/NoteDetailsComponent';

const mapStateToProps = ({
  notesMindMap: { selectedNote },
  noteDetails: { noteName, noteContent, editorState },
}) => {
  return {
    selectedNote,
    noteContent,
    noteName,
    editorState,
  };
};

const mapDispatchToProps = dispatch => ({
  editorNoteNameChangedAction: data =>
    dispatch({ type: EDITOR_NOTE_NAME_CHANGED_ACTION, data }),
  editorNoteContentChangedAction: data =>
    dispatch({ type: EDITOR_NOTE_CONTENT_CHANGED_ACTION, data }),
});

export const NoteDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NoteDetailsComponent);
