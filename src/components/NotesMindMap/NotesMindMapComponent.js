import React, { Component } from 'react';

import PropTypes from 'prop-types';
import VisGraph from 'react-graph-vis';
import noteStorage from 'storage/noteStorage';

import { NoteNameEditorComponent } from 'components/NoteNameEditor/NoteNameEditorComponent';
import { StyledNotesMindMap } from 'components/NotesMindMap/NotesMindMapStyles';

import { VisNetworkHelper } from 'helpers/visNetworkHelper';

export class NotesMindMapComponent extends Component {
  render() {
    const {
      selectedNote,
      showNoteNameEditor,
      isChangeParentModeActive,
      nodes,
      edges,
    } = this.props;

    const visGraph = { nodes, edges };

    const visOptions = {
      interaction: {
        keyboard: false,
      },
      edges: {
        // arrows: { to: true },
        arrows: {
          to: {
            enabled: false,
          },
        },
        color: '#F2F2F2',
        // dashes: true,
        smooth: true,
      },
      nodes: {
        borderWidth: 2,
        shape: 'box',
        color: '#BB86FC',
        margin: 10,
        font: {
          color: '#F2F2F2',
          size: 15,
          face: 'raleway',
        },
      },

      groups: {
        children: {
          borderWidth: 2,
          shape: 'box',
          color: '#5dbcaf',
          margin: 10,
          font: {
            color: '#F2F2F2',
            size: 15,
            face: 'raleway',
          },
        },
        parent: {
          borderWidth: 2,
          shape: 'box',
          color: '#BB86FC',
          margin: 10,
          font: {
            color: '#F2F2F2',
            size: 15,
            face: 'raleway',
          },
        },
      },
    };

    const visEvents = {
      click: this.visNetworkClickHandler,
      doubleClick: this.visNetworkDoubleClickHandler,
      hold: this.visNetworkHoldHandler,
    };

    return (
      <StyledNotesMindMap>
        <VisGraph graph={visGraph} events={visEvents} options={visOptions} />
        {showNoteNameEditor && (
          <NoteNameEditorComponent
            note={selectedNote}
            onChange={this.handleNoteNameUpdate}
            onChangeParentClick={this.props.onChangeParentButtonClick}
            onDeleteClick={this.onDeleteClick}
            isChangeParentModeActive={isChangeParentModeActive}
          />
        )}
      </StyledNotesMindMap>
    );
  }

  noteClickHandler = targetNoteId => {
    const { selectedNote } = this.props;

    // if clicking on the current note, do nothing.
    if (targetNoteId === selectedNote.id) return;

    const nodes = this.props.nodes;

    const targetNote = nodes.find(note => note.id === targetNoteId);

    if (!targetNote) {
      throw new Error(
        "noteClickHandler(): couldn't find targetNote: ",
        targetNoteId,
      );
    }

    this.props.changeSelectedNote({
      note: targetNote,
      edges: this.props.edges,
    });
  };

  visNetworkClickHandler = event => {
    const { selectedNote } = this.props;
    const { edges } = this.props;
    const { isChangeParentModeActive } = this.props;

    this.props.onMindMapClick();
    if (VisNetworkHelper.clickedOnNote(event)) {
      let targetNoteId = VisNetworkHelper.getTargetNoteId(event);
      const targetNote = this.props.nodes.find(
        note => note.id === targetNoteId,
      );

      if (isChangeParentModeActive) {
        this.props.changeParentNote({
          noteId: selectedNote.id,
          currentParentId: edges.find(edge => edge.to === selectedNote.id).id,
          newParent: targetNote,
          edges,
        });
      } else {
        if (targetNote.id !== selectedNote.id) {
          this.props.changeSelectedNote({
            note: targetNote,
            edges: this.props.edges,
          });
        }
      }
    }
  };

  visNetworkDoubleClickHandler = event => {
    const { nodes } = this.props;
    if (VisNetworkHelper.clickedOnNote(event)) {
      let targetNoteId = VisNetworkHelper.getTargetNoteId(event);
      const targetNote = nodes.find(node => node.id === targetNoteId);
      this.props.createEmptyChild({ parent: targetNote });
    }
  };

  visNetworkHoldHandler = event => {
    const { nodes } = this.props;
    if (VisNetworkHelper.clickedOnNote(event)) {
      let targetNoteId = VisNetworkHelper.getTargetNoteId(event);
      const targetNote = nodes.find(node => node.id === targetNoteId);
      this.editNote(targetNote);
    }
  };

  editNote(targetNote) {
    const { nodes } = this.props;
    const note = nodes.find(node => node.id === targetNote.id);

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
}

NotesMindMapComponent.propTypes = {
  selectedNote: PropTypes.object.isRequired,
  changeSelectedNote: PropTypes.func.isRequired,
  createEmptyChild: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  isChangeParentModeActive: PropTypes.bool.isRequired,
  changeParentNote: PropTypes.func.isRequired,
  showNoteNameEditor: PropTypes.bool.isRequired,
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
  onMindMapClick: PropTypes.func.isRequired,
  editNote: PropTypes.func.isRequired,
  updateNoteName: PropTypes.func.isRequired,
  onChangeParentButtonClick: PropTypes.func.isRequired,
};
