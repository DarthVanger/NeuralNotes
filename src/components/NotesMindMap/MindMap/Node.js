import React from 'react';
import { useSelector } from 'react-redux';

import NodeBackground from './NodeBackground';
import { colors, nodeBorderColor } from 'colors';
import {
  isChangeParentModeActiveSelector,
  isSelectedNoteLoadingSelector,
} from 'components/NotesMindMap/NotesMindMapSelectors';
import { isNodeDecendantOf } from 'helpers/graph';
import useSelectedNote from 'components/NotesMindMap/hooks/useSelectedNote';
import useGraph from 'components/NotesMindMap/hooks/useGraph';

export const Node = node => {
  const isChangeParentModeActive = useSelector(
    isChangeParentModeActiveSelector,
  );
  const selectedNote = useSelectedNote();
  const graph = useGraph();
  const isSelectedNoteLoading = useSelector(isSelectedNoteLoadingSelector);

  const { x, y, label, width, height, padding, debug, domAttributes } = node;

  const isSelectedNote = node.id === selectedNote.id;

  const textStyle = {
    fill: isSelectedNote ? colors.primary : nodeBorderColor,
  };

  const isDecendantOfSelectedNote = isNodeDecendantOf(
    graph,
    node,
    selectedNote,
  );

  // highlight the whole tree of the selected node when changing parent
  const isPartOfSelectedTree =
    isChangeParentModeActive && isDecendantOfSelectedNote;

  return (
    <g {...domAttributes} transform={`translate(${x} ${y})`}>
      <NodeBackground
        width={width}
        height={height}
        padding={padding}
        debug={debug}
        isSelected={isSelectedNote || isPartOfSelectedTree}
        isLoading={isSelectedNote && isSelectedNoteLoading}
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
