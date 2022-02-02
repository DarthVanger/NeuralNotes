import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import NodeBackground from './NodeBackground';
import { colors, nodeBorderColor } from 'colors';
import { isChangeParentModeActiveSelector } from 'components/NotesMindMap/NotesMindMapSelectors';
import { isNodeDecendantOf } from 'helpers/graph';
import useSelectedNote from 'components/NotesMindMap/hooks/useSelectedNote';
import useGraph from 'components/NotesMindMap/hooks/useGraph';
import {
  mindMapNodeClickedAction,
  mindMapNodeDoubleClickedAction,
} from 'components/NotesMindMap/NotesMindMapActions';

export const Node = node => {
  const dispatch = useDispatch();

  const isChangeParentModeActive = useSelector(
    isChangeParentModeActiveSelector,
  );
  const selectedNote = useSelectedNote();
  const graph = useGraph();

  const {
    x,
    y,
    name,
    width,
    height,
    padding,
    isLoading,
    isSaving,
    isUploading,
    didNoteSaveFail,
    debug,
  } = node;

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

  const handleClick = () => {
    dispatch(
      mindMapNodeClickedAction({
        targetNode: node,
        graph,
        selectedNote,
        isChangeParentModeActive,
      }),
    );
  };

  const handleDoubleClick = () => {
    dispatch(
      mindMapNodeDoubleClickedAction({
        targetNode: node,
        isChangeParentModeActive,
      }),
    );
  };

  return (
    <g
      transform={`translate(${x} ${y})`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      key={node.id}>
      <NodeBackground
        width={width}
        height={height}
        padding={padding}
        debug={debug}
        isSelected={isSelectedNote || isPartOfSelectedTree}
        isLoading={isLoading}
        didNoteSaveFail={didNoteSaveFail}
        isSaving={isSaving}
        isUploading={isUploading}
      />
      <g transform={`translate(${padding}, -${padding})`}>
        <text
          transform={`translate(${-width / 2}, ${height / 2})`}
          style={textStyle}>
          {name}
        </text>
      </g>
    </g>
  );
};
