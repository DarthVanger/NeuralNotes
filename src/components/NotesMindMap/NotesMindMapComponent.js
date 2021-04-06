import React, { Component } from 'react';

import PropTypes from 'prop-types';
import MindMap, { Node, Edge } from './MindMap/MindMap.js';

import { StyledNotesMindMap } from 'components/NotesMindMap/NotesMindMapStyles';
import { getDepth } from 'helpers/graph';

const scrollByMouseDrag = (() => el => {
  let isMouseDown = false;
  const clickPosition = {};
  const clickScroll = {};

  const scroll = e => {
    const dx = e.pageX - clickPosition.x;
    const dy = e.pageY - clickPosition.y;
    el.current.scroll(clickScroll.x - dx, clickScroll.y - dy);
  };

  const pauseEvent = e => {
    e.stopPropagation();
    e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  };

  return {
    onMouseMove: e => {
      pauseEvent(e);
      isMouseDown && scroll(e);
    },
    onMouseDown: e => {
      e.persist();
      pauseEvent(e);
      const isClickOnSvg = e.target == el.current.querySelector('svg');
      if (isClickOnSvg) {
        isMouseDown = true;
        clickScroll.y = el.current.scrollTop;
        clickScroll.x = el.current.scrollLeft;
        clickPosition.y = e.pageY;
        clickPosition.x = e.pageX;
        el.current.style.cursor = 'grab';
      }
    },
    onMouseUp: e => {
      isMouseDown = false;
      el.current.style.cursor = 'auto';
    },
  };
})();

export class NotesMindMapComponent extends Component {
  constructor(props) {
    super(props);
    this.mindMapContainerRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nodes.length !== this.props.nodes.length) {
      const el = this.mindMapContainerRef.current;
      const depth = getDepth(this.props.nodes, this.props.edges);

      el && depth > 1 && el.scroll(el.scrollLeft + 250, el.scrollTop + 250);
    }
  }

  render() {
    const { selectedNote, nodes, edges } = this.props;

    if (!nodes?.length) return null;

    return (
      <>
        <StyledNotesMindMap
          {...scrollByMouseDrag(this.mindMapContainerRef)}
          ref={this.mindMapContainerRef}>
          <MindMap
            nodes={nodes.map(n => (
              <Node
                id={n.id}
                key={n.id}
                label={n.name}
                onClick={() => this.handleNodeClick(n)}
              />
            ))}
            edges={edges.map(e => (
              <Edge {...e} />
            ))}
          />
        </StyledNotesMindMap>
      </>
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
