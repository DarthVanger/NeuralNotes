import React from 'react';
import NodeBackground from './NodeBackground';

export const Node = ({ x, y, label, textWidth, ...attrs }) => {
  const padding = 8;
  const width = textWidth + padding * 2;
  const height = 14 + padding * 2;

  return (
    <g {...attrs} transform={`translate(${x}, ${y})`}>
      <text>{label}</text>
      <NodeBackground width={width} height={height} padding={padding} />
    </g>
  );
};
