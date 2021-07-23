import React from 'react';
import NodeBackground from './NodeBackground';

export const Node = node => {
  const { x, y, label, width, height, padding, ...attrs } = node;

  return (
    <g {...attrs} transform={`translate(${x} ${y})`}>
      <NodeBackground width={width} height={height} padding={padding} />
      <g transform={`translate(${padding}, -${padding})`}>
        <text transform={`translate(${-width / 2}, ${height / 2})`}>
          {label}
        </text>
      </g>
    </g>
  );
};
