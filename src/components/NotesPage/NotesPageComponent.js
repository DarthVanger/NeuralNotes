import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ControlsHelpComponent } from 'components/ControlsHelp/ControlsHelpComponent';
import { NotesContentEditorContainer } from 'components/NotesContentEditor/NotesContentEditorContainer';
import { NotesMindMapViewComponent } from 'components/NotesMindMapView/NotesMindMapViewComponent';
import thoughtStorage from 'storage/thought-storage';

export class NotesPageComponent extends Component {
  render() {
    const { isHelpViewed, selectedNote, closeHelp } = this.props;

    return (
      <>
        <NotesMindMapViewComponent
          thoughts={thoughtStorage.getThoughts()}
          selectedThought={selectedNote}
          selectedThoughtId={selectedNote}
          changeNote={this.changeNote}
        />
        <NotesContentEditorContainer/>
        {!isHelpViewed && <ControlsHelpComponent onClose={closeHelp}/>}
      </>
    );
  }

  changeNote = note => {
    const { requestNoteText, changeSelectedNote } = this.props;
    changeSelectedNote(note);
    if (note.isNote) {
      requestNoteText(note);
    }
  };
}

NotesPageComponent.propTypes = {
  selectedNote: PropTypes.object.isRequired,
  isHelpViewed: PropTypes.bool.isRequired,
  closeHelp: PropTypes.func.isRequired,
  requestNoteText: PropTypes.func.isRequired
};
