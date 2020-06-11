import React, { Component } from 'react';
import { StyledNoteNameEditor } from 'components/NoteDetails/NoteDetailsStyles';

export class NoteDetailsComponent extends Component {
  handleChange(e) {
    this.props.onNoteNameChange(e.target.value);
  }

  render() {
    return (
      <StyledNoteNameEditor
        onChange={e => {
          this.handleChange(e);
        }}
        value={this.props.noteName}
      />
    );
  }
}
