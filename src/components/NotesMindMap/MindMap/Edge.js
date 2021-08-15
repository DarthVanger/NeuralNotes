import React from 'react';
import { useSelector } from 'react-redux';

import { colors, mindMapEdgeColor } from 'colors';
import { isChangeParentModeActiveSelector } from 'components/NotesMindMap/NotesMindMapSelectors';
import { isNodeDecendantOf } from 'helpers/graph';
import useSelectedNote from 'components/NotesMindMap/hooks/useSelectedNote';
import useGraph from 'components/NotesMindMap/hooks/useGraph';

export const Edge = ({ parentNode, childNode }) => {
  const selectedNote = useSelectedNote();
  const isChangeParentModeActive = useSelector(
    isChangeParentModeActiveSelector,
  );
  const graph = useGraph();

  let changeParentModeStyle = {};
  if (isChangeParentModeActive) {
    if (childNode.id === selectedNote.id) {
      changeParentModeStyle = { strokeDasharray: '6', stroke: colors.primary };
    }

    // highlight edges of all decendants of the selected note
    if (
      parentNode.id === selectedNote.id ||
      isNodeDecendantOf(graph, parentNode, selectedNote)
    ) {
      changeParentModeStyle = { stroke: colors.primary };
    }
  }

  /**
   * Straight line from center of parent to center of child
   */
  const svgPathShape = `
    M ${parentNode.x} ${parentNode.y}
    L ${childNode.x} ${childNode.y}
  `;

  return (
    <>
      <path
        d={svgPathShape}
        stroke={mindMapEdgeColor}
        strokeWidth="2"
        fill="none"
        key={`${parentNode.id}->${childNode.id}3`}
        {...changeParentModeStyle}
      />
    </>
  );
};
