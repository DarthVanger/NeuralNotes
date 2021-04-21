import React, { Component } from 'react';

import PropTypes from 'prop-types';
import VisGraph from 'react-graph-vis';

import { StyledNotesMindMap } from 'components/NotesMindMap/NotesMindMapStyles';

import { VisNetworkHelper } from 'helpers/visNetworkHelper';
import { colors } from 'colors';

export class NotesMindMapComponent extends Component {
  render() {
    const { nodes, edges } = this.props;

    const visNodes = nodes.map(node => ({
      ...node,
      label: node.name,
    }));

    const visGraph = { nodes: visNodes, edges };

    const visOptions = {
      interaction: {
        keyboard: false,
      },
      edges: {
        arrows: {
          to: {
            enabled: false,
          },
        },
        color: colors.titleColor,
        smooth: true,
      },
      nodes: {
        borderWidth: 2,
        shape: 'box',
        color: colors.primaryColor,
        margin: 10,
        font: {
          color: colors.titleColor,
          size: 15,
          face: 'raleway',
        },
      },

      groups: {
        children: {
          borderWidth: 2,
          shape: 'box',
          color: colors.secondaryColor,
          margin: 10,
          font: {
            color: colors.titleColor,
            size: 15,
            face: 'raleway',
          },
        },
        parent: {
          borderWidth: 2,
          shape: 'box',
          color: colors.primaryColor,
          margin: 10,
          font: {
            color: colors.titleColor,
            size: 15,
            face: 'raleway',
          },
        },
      },
    };

    const visEvents = {
      click: this.visNetworkClickHandler,
    };

    return (
      <StyledNotesMindMap>
        <VisGraph graph={visGraph} events={visEvents} options={visOptions} />
      </StyledNotesMindMap>
    );
  }

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
}

NotesMindMapComponent.propTypes = {
  selectedNote: PropTypes.object.isRequired,
  changeSelectedNote: PropTypes.func.isRequired,
  isChangeParentModeActive: PropTypes.bool.isRequired,
  changeParentNote: PropTypes.func.isRequired,
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
  onMindMapClick: PropTypes.func.isRequired,
  updateNoteName: PropTypes.func.isRequired,
};
