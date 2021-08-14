import React from 'react';
import NodeBackground from './NodeBackground';
import { colors } from 'colors';

export const Node = node => {
  const {
    x,
    y,
    label,
    width,
    height,
    padding,
    debug,
    domAttributes,
    customAttributes,
  } = node;

  const { isSelected } = customAttributes;

  const textStyle = {
    fill: isSelected ? colors.primaryColor : colors.secondaryColor,
  };

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
