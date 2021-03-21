import { connect } from 'react-redux';
import { action } from 'sagas';

import {
  EDITOR_NOTE_NAME_CHANGED_ACTION,
  EDITOR_NOTE_CONTENT_CHANGED_ACTION,
} from 'components/NoteDetails/NoteDetailsActions';
import { NoteDetailsComponent } from 'components/NoteDetails/NoteDetailsComponent';

const mapStateToProps = ({
  notesMindMap: { selectedNote },
  noteDetails: { noteName, noteContent, areChangesSaved },
}) => {
  return {
    selectedNote,
    noteContent,
    noteName,
    areChangesSaved,
  };
};

const mapDispatchToProps = () => ({
  onNoteNameChange: ({ note, newNoteName }) => {
    action(EDITOR_NOTE_NAME_CHANGED_ACTION, { note, newNoteName });
  },
  onNoteContentChange: ({ note, noteContent }) => {
    action(EDITOR_NOTE_CONTENT_CHANGED_ACTION, { note, noteContent });
  },
});

export const NoteDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NoteDetailsComponent);
