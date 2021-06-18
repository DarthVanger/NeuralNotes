import React, { Component } from 'react';

import PropTypes from 'prop-types';
import MindMap from './MindMap/MindMap.js';
import { StyledNotesMindMap } from 'components/NotesMindMap/NotesMindMapStyles';

export class NotesMindMapComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { selectedNote, nodes, edges } = this.props;

    if (!nodes?.length) return null;

    const mindMapNodes = nodes.map(n => ({
      id: n.id,
      key: n.id,
      label: n.name,
      onClick: () => this.handleNodeClick(n),
    }));

    return (
      <StyledNotesMindMap>
        <MindMap
          nodes={mindMapNodes}
          edges={edges}
          focusNodeId={selectedNote.id}
        />
      </StyledNotesMindMap>
    );
  }

  handleNodeClick(targetNode) {
    this.props.onMindMapClick();
    console.log('node clicked', targetNode);
    const { selectedNote } = this.props;

    // if clicking on the current note, do nothing.
    if (targetNode.id === selectedNote.id) return;

    const nodes = this.props.nodes;

    const targetNote = nodes.find(note => note.id === targetNode.id);

    if (!targetNote) {
      throw new Error(
        "noteClickHandler(): couldn't find targetNode: ",
        targetNode,
      );
    }

    this.props.changeSelectedNote({
      note: targetNote,
      edges: this.props.edges,
    });
  }
}

NotesMindMapComponent.propTypes = {
  selectedNote: PropTypes.object.isRequired,
  changeSelectedNote: PropTypes.func.isRequired,
  isChangeParentModeActive: PropTypes.bool.isRequired,
  changeParentNote: PropTypes.func.isRequired,
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
  onMindMapClick: PropTypes.func.isRequired,
};
