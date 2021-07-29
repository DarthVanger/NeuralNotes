import React from 'react';
import NodeBackground from './NodeBackground';

export const Node = node => {
  const { x, y, label, width, height, padding, debug, domAttributes } = node;

  return (
    <g {...domAttributes} transform={`translate(${x} ${y})`}>
      <NodeBackground
        width={width}
        height={height}
        padding={padding}
        debug={debug}
      />
      <g transform={`translate(${padding}, -${padding})`}>
        <text transform={`translate(${-width / 2}, ${height / 2})`}>
          {label}
        </text>
      </g>
    </g>
  );
};
