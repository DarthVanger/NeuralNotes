import React, { Component } from 'react';
import { StyledNoteNameEditor } from 'components/NoteDetails/NoteDetailsStyles';

export class NoteDetailsComponent extends Component {
  handleChange(e) {
    console.log('props.onNoteNameChange: ', this.props.onNoteNameChange);
    this.props.onNoteNameChange(e.target.value);
  }

  render() {
    console.log('props', this.props);
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
