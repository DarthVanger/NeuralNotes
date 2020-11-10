import { connect } from 'react-redux';
import { action } from 'sagas';

import { SAVE_NOTE_CONTENT_ACTION } from 'components/NotesContentEditor/NotesContentEditorActions';
import { NotesContentEditorComponent } from 'components/NotesContentEditor/NotesContentEditorComponent';

const mapStateToProps = ({ notesMindMap: { selectedNote, noteText } }) => {
  return {
    selectedNote,
    noteText,
  };
};

const mapDispatchToProps = () => ({
  updateNoteContent: note => action(SAVE_NOTE_CONTENT_ACTION, note),
});

export const NotesContentEditorContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotesContentEditorComponent);
