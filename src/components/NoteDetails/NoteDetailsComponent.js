import React, { Component } from 'react';

import {
  StyledNoteNameEditor,
  StyledNoteDetailsScreen,
  StyledNoteContentEditor,
} from 'components/NoteDetails/NoteDetailsStyles';

export class NoteDetailsComponent extends Component {
  handleNoteNameChange(e) {
    this.props.onNoteNameChange({
      newNoteName: e.target.value,
      note: this.props.selectedNote,
    });
  }

  handleNoteContentChange(e) {
    this.props.onNoteContentChange({
      note: this.props.selectedNote,
      noteContent: e.target.value,
    });
  }

  render() {
    return (
      <StyledNoteDetailsScreen>
        <StyledNoteNameEditor
          onChange={e => {
            this.handleNoteNameChange(e);
          }}
          value={this.props.noteName}
          placeholder="Title"
          rows="1"
        />
        <StyledNoteContentEditor
          onChange={e => {
            this.handleNoteContentChange(e);
          }}
          value={this.props.noteContent}
          rows="5"
        />
      </StyledNoteDetailsScreen>
    );
  }
}
