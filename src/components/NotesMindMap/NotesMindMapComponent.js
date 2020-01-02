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

    const visGraph = this.treeToVisGraph();

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
    const { rootNote, selectedNote } = this.props;
    const { isChangeParentModeActive } = this.props;

    this.props.onMindMapClick();
    if (VisNetworkHelper.clickedOnNote(event)) {
      let targetNoteId = VisNetworkHelper.getTargetNoteId(event);
      const targetNote = tree(rootNote).find(node => node.id === targetNoteId);

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

  treeToVisGraph() {
    const rootNote = this.props.rootNote;
    const visNodes = [];
    const visEdges = [];

    if (!rootNote) {
      throw new Error('Can not render the mind map without a root node');
    }

    visNodes.push({ id: rootNote.id, label: rootNote.name });
    addChildren(rootNote);

    return {
      nodes: visNodes,
      edges: visEdges
    };

    function addChildren(node) {
      if (node.children) {
        node.children.forEach((child) => {
          const hasChildren = child.children && child.children.length;
          visNodes.push({ id: child.id, label: child.name, group: (hasChildren ? 'parent' : 'children') });
          visEdges.push({ from: node.id, to: child.id });
          addChildren(child);
        });
      } else {
        return;
      }
    }
  }
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
  onMindMapClick: PropTypes.func.isRequired,
  editNote:  PropTypes.func.isRequired,
  updateNoteName:  PropTypes.func.isRequired,
  onChangeParentButtonClick: PropTypes.func.isRequired,
};
