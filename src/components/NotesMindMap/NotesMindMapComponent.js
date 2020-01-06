import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisGraph from 'react-graph-vis';

import { VisNetworkHelper } from 'helpers/visNetworkHelper';
import noteStorage from 'storage/noteStorage';
import { NoteNameEditorComponent } from 'components/NoteNameEditor/NoteNameEditorComponent';
import { StyledNotesMindMap } from 'components/NotesMindMap/NotesMindMapStyles';
import tree from 'helpers/tree';

export class NotesMindMapComponent extends Component {
  render() {
    const {
      selectedNote,
      showNoteNameEditor,
      isChangeParentModeActive
    } = this.props;

    let visGraph = {
      nodes: [ ...this.props.nodes ],
      edges: [ ...this.props.edges ]
    };

    const visOptions = {
      interaction: {
        keyboard: false
      },
      edges: {
        arrows: { to: true },
        smooth: true
      },
      groups: {
        children: {
          color: {
            background: '#eef',
            borderWidth: 3
          }
        },
        parent: {
          color: {
            background: '#faa'
          }
        }
      }

    };

    const visEvents = {
      click: this.visNetworkClickHandler,
      doubleClick: this.visNetworkDoubleClickHandler,
      hold: this.visNetworkHoldHandler,
    };

    return (
      <StyledNotesMindMap>
        <VisGraph graph={visGraph} events={visEvents} options={visOptions} />
        {showNoteNameEditor && <NoteNameEditorComponent
          note={selectedNote}
          onChange={this.handleNoteNameUpdate}
          onChangeParentClick={this.props.onChangeParentButtonClick}
          onDeleteClick={this.onDeleteClick}
          onUploadFileClick={this.onUploadFileClick}
          isChangeParentModeActive={ isChangeParentModeActive } 
        />}
      </StyledNotesMindMap>
    );
  }

  noteClickHandler = targetNoteId => {
    const { selectedNote } = this.props;

    // if clicking on the current note, do nothing.
    if (targetNoteId === selectedNote.id) return;

    const rootNote = this.props.rootNote;

    const targetNote = tree(rootNote).find(node => node.id === targetNoteId);

    if (!targetNote) {
      throw new Error('noteClickHandler(): couldn\'t find targetNote: ', targetNoteId);
    }

    this.props.changeSelectedNote(targetNote);
  };

  visNetworkClickHandler = event => {
    const { selectedNote } = this.props;
    const { isChangeParentModeActive } = this.props;

    this.props.onMindMapClick();
    if (VisNetworkHelper.clickedOnNote(event)) {
      let targetNoteId = VisNetworkHelper.getTargetNoteId(event);
      const targetNote = this.props.nodes.filter(node => node.id === targetNoteId)[0]

      if (isChangeParentModeActive) {
        this.props.changeParentNote({
          noteId: selectedNote.id,
          currentParentId: selectedNote.parent.id,
          newParent: targetNote,
        });
      } else {
        if (targetNote.id !== selectedNote.id) {
          this.props.changeSelectedNote(targetNote);
        }
      }
    }
  };

  visNetworkDoubleClickHandler = event => {
    console.log('double CLICK')
    const { rootNote } = this.props;
    if (VisNetworkHelper.clickedOnNote(event)) {
      let targetNoteId = VisNetworkHelper.getTargetNoteId(event);
      const targetNote = tree(rootNote).find(node => node.id === targetNoteId);
      this.props.createEmptyChild({ parent: targetNote, rootNote: rootNote });
    }
  };

  visNetworkHoldHandler = event => {
    const { rootNote } = this.props;
    if (VisNetworkHelper.clickedOnNote(event)) {
      let targetNoteId = VisNetworkHelper.getTargetNoteId(event);
      const targetNote = tree(rootNote).find(node => node.id === targetNoteId);
      this.editNote(targetNote);
    }
  };

  editNote(targetNote) {
    const { rootNote } = this.props;
    const note = tree(rootNote).find(node => node.id === targetNote.id);

    if (note.name === noteStorage.APP_FOLDER_NAME || !note.isNote) {
      return;
    }

    this.props.editNote(note);
  }

  handleNoteNameUpdate = newName => {
    const note = this.props.selectedNote;
    this.props.updateNoteName({ note, newName });
  };

  onDeleteClick = () => {
    let note = this.props.selectedNote;
    this.props.deleteNote({ note });
  };

  onUploadFileClick = () => {
    window.open(noteStorage.getLinkToNote(this.props.selectedNote));
  };
}

NotesMindMapComponent.propTypes = {
  selectedNote: PropTypes.object.isRequired,
  changeSelectedNote: PropTypes.func.isRequired,
  createEmptyChild: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  isChangeParentModeActive: PropTypes.bool.isRequired,
  changeParentNote: PropTypes.func.isRequired,
  showNoteNameEditor: PropTypes.bool.isRequired,
  rootNote: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
  onMindMapClick: PropTypes.func.isRequired,
  editNote:  PropTypes.func.isRequired,
  updateNoteName:  PropTypes.func.isRequired,
  onChangeParentButtonClick: PropTypes.func.isRequired,
};
