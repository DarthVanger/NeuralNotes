import React, { Component } from 'react';
import {
  StyledNoteNameEditor,
  StyledDetailsScreen,
  StyledNoteContentEditor,
} from 'components/NoteDetails/NoteDetailsStyles';

export class NoteDetailsComponent extends Component {
  handleChangeNoteName(e) {
    console.log('props.onNoteNameChange: ', this.props.onNoteNameChange);
    this.props.onNoteNameChange(e.target.value);
  }

  handleChangeNoteContent(e) {
    console.log('props.onNoteContentChange: ', this.props.onNoteContentChange);
    console.log('propsText', this.props);
    this.props.onNoteContentChange(e.target.value);
  }

  render() {
    console.log('props', this.props);
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
