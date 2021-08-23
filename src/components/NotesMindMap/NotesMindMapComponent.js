import React, { Component } from 'react';

import PropTypes from 'prop-types';
import MindMap from './MindMap/MindMap.js';
import { StyledNotesMindMap } from 'components/NotesMindMap/NotesMindMapStyles';
import MindMapLoadedFromMemoryNotification from './notifications/MindMapLoadedFromMemoryNotification/MindMapLoadedFromMemoryNotification';
import NoteIsTrashedDialog from './notifications/NoteIsTrashedDialog/NoteIsTrashedDialog';
import NoteIsPermanentlyDeletedDialog from './notifications/NoteIsPermanentlyDeletedDialog/NoteIsPermanentlyDeletedDialog';
import { getParentNode } from 'helpers/graph';

export class NotesMindMapComponent extends Component {
  constructor(props) {
    super(props);
    this.elementRef = React.createRef();
  }

  componentDidMount() {
    this.elementRef.current.focus();
  }

  /**
   * Hotkeys to create a child or sibling note
   */
  handleKeyDown(event) {
    const { nodes, edges, selectedNote } = this.props;
    const graph = { nodes, edges };

    // On 'Tab' create a child note
    if (event.key === 'Tab') {
      event.preventDefault();
      this.props.addNoteButtonClicked(selectedNote);
    }
    // On 'Enter' create a sibling note
    if (event.key === 'Enter') {
      event.preventDefault();
      const parentNote = getParentNode(graph, selectedNote);
      this.props.addNoteButtonClicked(parentNote);
    }
  }

  render() {
    const { selectedNote, nodes, edges } = this.props;

    return (
      <>
        <StyledNotesMindMap
          tabIndex={0}
          onKeyDown={e => this.handleKeyDown(e)}
          ref={this.elementRef}>
          {nodes?.length > 0 && (
            <MindMap
              nodes={nodes}
              edges={edges}
              focusNodeId={selectedNote.id}
            />
          )}
        </StyledNotesMindMap>
        <MindMapLoadedFromMemoryNotification />
        <NoteIsTrashedDialog />
        <NoteIsPermanentlyDeletedDialog />
      </>
    );
  }
}

NotesMindMapComponent.propTypes = {
  selectedNote: PropTypes.object.isRequired,
  isChangeParentModeActive: PropTypes.bool.isRequired,
  changeParentNote: PropTypes.func.isRequired,
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
};
