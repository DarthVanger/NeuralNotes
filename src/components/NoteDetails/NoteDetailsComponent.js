import React, { Component } from 'react';
import {
  StyledNoteNameEditor,
  StyledDetailsScreen,
  StyledNoteContentEditor,
} from 'components/NoteDetails/NoteDetailsStyles';

export class NoteDetailsComponent extends Component {
  handleChangeNoteName(e) {
    this.props.onNoteNameChange({
      newNoteName: e.target.value,
      note: this.props.selectedNote,
    });
  }

  handleChangeNoteContent(e) {
    this.props.onNoteContentChange({
      note: this.props.selectedNote,
      noteText: e.target.value,
    });
  }

  render() {
    return (
      <StyledDetailsScreen>
        <StyledNoteNameEditor
          onChange={e => {
            this.handleChangeNoteName(e);
          }}
          value={this.props.noteName}
          placeholder="Title"
          rows="1"
        />
        <StyledNoteContentEditor
          onChange={e => {
            this.handleChangeNoteContent(e);
          }}
          value={this.props.noteText}
          rows="5"
        />
      </StyledDetailsScreen>
    );
  }
}
