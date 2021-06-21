import React from 'react';
import NodeBackground from './NodeBackground';
import { getNodeEndCorner, getNodeEdgeCornerNames } from './geometry';

export const Node = node => {
  const { x, y, label, width, height, padding, ...attrs } = node;

  const { end: endCornerName } = getNodeEdgeCornerNames(node);
  //const corner = getNodeEndCorner(node);

  let coords;
  if (endCornerName === 'bottomRight') coords = { x: x - width, y };
  if (endCornerName === 'topRight') coords = { x: x - width, y: y + height };

  //const coords = { x: x - (corner.x - x), y: y - (corner.y - y) };

  return (
    <g {...attrs} transform={`translate(${coords.x} ${coords.y})`}>
      <NodeBackground width={width} height={height} padding={padding} />
      <text transform={`translate(${padding}, -${padding})`}>{label}</text>
    </g>
  );
};
