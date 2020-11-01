import React, { Component } from 'react';

import PropTypes from 'prop-types';
import noteStorage from 'storage/noteStorage';

import {
  StyledLink,
  StyledSelectedNotesContent,
  StyledTextArea,
} from 'components/NotesContentEditor/NotesContentEditorStyles';

import { debounce } from '../../helpers/debounce';

const REAL_TIME_SAVING_INTERVAL_MS = 1000;

export class NotesContentEditorComponent extends Component {
  state = {
    text: '',
    noteText: '',
  };

  textAreaRef = React.createRef();

  debouncedUpdate = debounce(
    this.updateNoteContent,
    REAL_TIME_SAVING_INTERVAL_MS,
  );

  render() {
    const { text } = this.state;

    const {
      selectedNote,
      selectedNote: { isNote },
    } = this.props;
    const link = noteStorage.getLinkToNote(selectedNote);

    return (
      <StyledSelectedNotesContent>
        {isNote ? (
          <StyledTextArea
            ref={this.textAreaRef}
            onChange={this.onChange}
            placeholder="Your note..."
            value={text}
          />
        ) : (
          <StyledLink
            className="btn btn-primary btn-lg"
            target="_blank"
            rel="noopener noreferrer"
            href={link}>
            Open in Google Drive
          </StyledLink>
        )}
      </StyledSelectedNotesContent>
    );
  }

  onChange = () => {
    this.setState({ text: this.textAreaRef.current.value });
    this.debouncedUpdate();
  };

  static getDerivedStateFromProps({ noteText }, state) {
    console.log(`Load note: ${noteText}`);
    if (noteText !== state.noteText) {
      return {
        text: noteText,
        noteText,
      };
    }
    return null;
  }

  updateNoteContent() {
    const { updateNoteContent, selectedNote } = this.props;
    selectedNote.content = this.textAreaRef.current.value;
    updateNoteContent(selectedNote);
  }
}

NotesContentEditorComponent.propTypes = {
  selectedNote: PropTypes.object.isRequired,
  noteText: PropTypes.string.isRequired,
  updateNoteContent: PropTypes.func.isRequired,
};
