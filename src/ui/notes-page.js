import React, { Component } from 'react';

import { ControlsHelp } from 'ui/controls-help';
import { ThoughtContentEditor } from 'ui/thought-content-editor';
import { ThoughtsMindMapView } from 'thought/view-thoughts/thoughts-mind-map-view';
import thoughtStorage from 'storage/thought-storage';

export class NotesPage extends Component {
  state = {
    showHelp: !NotesPage.wasSeenByUser(),
    selectedNote: thoughtStorage.getRoot(),
    noteText: ''
  };

  render() {
    const { showHelp, selectedNote, noteText } = this.state;
    return (
      <>
        <ThoughtsMindMapView
          thoughts={thoughtStorage.getThoughts()}
          selectedThought={selectedNote}
          selectedThoughtId={selectedNote}
          changeNote={this.changeNote}
        />
        <ThoughtContentEditor note={selectedNote} noteText={noteText}/>
        {showHelp && <ControlsHelp onClick={this.recordUserView}/>}
      </>
    );
  }

  changeNote = note => {
    this.setState({
      selectedNote: note,
      noteText: note.isNote ? 'loading thought contents...' : ''
    });
    if (note.isNote) {
      this.requestNoteText();
    }
  };

  requestNoteText() {
    thoughtStorage.getThoughtContent(this.state.selectedNote)
      .then(noteText => {
        console.debug('ThoughtContentController.loadThought(), loaded thought content: ', noteText);
        this.setState({ noteText });
      });
  }

  recordUserView = () => {
    localStorage.setItem('controls_help:viewed', '1');
    this.setState({ showHelp: !NotesPage.wasSeenByUser() });
  };

  static wasSeenByUser() {
    return localStorage.getItem('controls_help:viewed');
  }
}
