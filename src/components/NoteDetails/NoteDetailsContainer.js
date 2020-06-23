import { connect } from 'react-redux';
import { action } from 'sagas';

import {
  EDITOR_NOTE_NAME_CHANGED_ACTION,
  EDITOR_NOTE_CONTENT_CHANGED_ACTION,
} from 'components/NoteDetails/NoteDetailsActions';
import { NoteDetailsComponent } from 'components/NoteDetails/NoteDetailsComponent';

const mapStateToProps = ({
  notesMindMap: { selectedNote },
  noteDetails: { noteName, noteText },
}) => {
  return {
    selectedNote,
    noteText,
    noteName,
  };
};

const mapDispatchToProps = () => ({
  onNoteNameChange: noteName => {
    console.log('noteName_beforeAction:', noteName);
    action(EDITOR_NOTE_NAME_CHANGED_ACTION, noteName);
  },
  onNoteContentChange: noteText => {
    console.log('noteContent_beforeAction:', noteText);
    action(EDITOR_NOTE_CONTENT_CHANGED_ACTION, noteText);
  },
});

export const NoteDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NoteDetailsComponent);
