import React from 'react';
import { useSelector } from 'react-redux';

import NodeBackground from './NodeBackground';
import { colors, nodeBorderColor } from 'colors';
import { isChangeParentModeActiveSelector } from 'components/NotesMindMap/NotesMindMapSelectors';
import { isNodeDecendantOf } from 'helpers/graph';
import useSelectedNote from 'components/NotesMindMap/hooks/useSelectedNote';
import useGraph from 'components/NotesMindMap/hooks/useGraph';

export const Node = node => {
  const isChangeParentModeActive = useSelector(
    isChangeParentModeActiveSelector,
  );
  const selectedNote = useSelectedNote();
  const graph = useGraph();

  const { x, y, label, width, height, padding, debug, domAttributes } = node;

  const textStyle = {
    fill: isSelected ? colors.primary : nodeBorderColor,
  };

  const isDecendantOfSelectedNote = isNodeDecendantOf(
    graph,
    node,
    selectedNote,
  );

  // highlight the whole tree of the selected node when changing parent
  const isPartOfSelectedTree =
    isChangeParentModeActive && isDecendantOfSelectedNote;

  const isSelected = node.id === selectedNote.id || isPartOfSelectedTree;

  return (
    <g {...domAttributes} transform={`translate(${x} ${y})`}>
      <NodeBackground
        width={width}
        height={height}
        padding={padding}
        debug={debug}
        isSelected={isSelected}
      />
      <g transform={`translate(${padding}, -${padding})`}>
        <text
          transform={`translate(${-width / 2}, ${height / 2})`}
          style={textStyle}>
          {label}
        </text>
      </g>
    </g>
  );
};
