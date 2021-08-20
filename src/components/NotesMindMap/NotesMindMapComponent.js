import React, { Component } from 'react';

import PropTypes from 'prop-types';
import MindMap from './MindMap/MindMap.js';
import { StyledNotesMindMap } from 'components/NotesMindMap/NotesMindMapStyles';
import MindMapLoadedFromMemoryNotification from './MindMapLoadedFromMemoryNotification/MindMapLoadedFromMemoryNotification';
import NoteIsTrashedDialog from './NoteIsTrashedDialog/NoteIsTrashedDialog';
import NoteIsPermanentlyDeletedDialog from './NoteIsPermanentlyDeletedDialog/NoteIsPermanentlyDeletedDialog';

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

    const handleMindMapRestoredFromLocalStorageNotificationClose = () => {
      this.props.mindMapRestoredFromLocalStorageNotificationClosed();
    };

    return (
      <>
        <StyledNotesMindMap>
          <MindMap
            nodes={mindMapNodes}
            edges={edges}
            focusNodeId={selectedNote.id}
          />
        </StyledNotesMindMap>
        <MindMapLoadedFromMemoryNotification />
        <NoteIsTrashedDialog />
        <NoteIsPermanentlyDeletedDialog />
      </>
    );
  }

  handleNodeClick(targetNode) {
    const { nodes, edges, selectedNote, isChangeParentModeActive } = this.props;
    const graph = { nodes, edges };
    this.props.mindMapNodeClicked({
      targetNode,
      graph,
      selectedNote,
      isChangeParentModeActive,
    });
  }
}

NotesMindMapComponent.propTypes = {
  selectedNote: PropTypes.object.isRequired,
  isChangeParentModeActive: PropTypes.bool.isRequired,
  changeParentNote: PropTypes.func.isRequired,
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
  mindMapNodeClicked: PropTypes.func.isRequired,
};
