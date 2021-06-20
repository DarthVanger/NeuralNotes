import React from 'react';
import NodeBackground from './NodeBackground';

export const Node = ({ x, y, label, width, height, padding, ...attrs }) => {
  return (
    <g {...attrs} transform={`translate(${x}, ${y})`}>
      <NodeBackground width={width} height={height} padding={padding} />
      <text transform={`translate(${padding}, -${padding})`}>{label}</text>
    </g>
  );
};
