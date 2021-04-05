import React from 'react';
import nodeBackground from './node-background.svg';
export const Node = ({ x, y, label, ...attrs }) => (
  <g {...attrs}>
    <image href={nodeBackground} x={x - 10} y={y - 20} />
    <text y={y} x={x}>
      {label}
    </text>
  </g>
);
