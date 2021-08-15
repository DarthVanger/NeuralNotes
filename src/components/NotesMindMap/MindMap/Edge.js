import React from 'react';
import { useSelector } from 'react-redux';

import { colors, mindMapEdgeColor } from 'colors';
import useSelectedNote from 'components/NotesMindMap/hooks/useSelectedNote';
import { isChangeParentModeActiveSelector } from 'components/NotesMindMap/NotesMindMapSelectors';

export const Edge = ({ parentNode, childNode }) => {
  const selectedNote = useSelectedNote();
  const isChangeParentModeActive = useSelector(
    isChangeParentModeActiveSelector,
  );

  const changeParentModeStyle =
    isChangeParentModeActive && childNode.id === selectedNote.id
      ? { strokeDasharray: '6', stroke: colors.primary }
      : {};

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
