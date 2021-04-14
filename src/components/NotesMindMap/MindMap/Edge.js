import React from 'react';
export const Edge = ({ parentNode, childNode }) => {
  const colorSeed = parentNode.props.x * parentNode.props.y;
  const randomColor = `rgb(${(colorSeed * 50) % 255}, ${(colorSeed * 100) %
    255}, ${(colorSeed * 150) % 255})`;

  /**
   * Straight line from parent to child, taking into account nodes width & height.
   */
  const svgPathShape = `
    M ${parentNode.props.x + parentNode.props.width} ${parentNode.props.y -
    parentNode.props.height / 2}
    L ${childNode.props.x} ${childNode.props.y - childNode.props.height / 2}
  `;

  return (
    <path
      d={svgPathShape}
      stroke={randomColor}
      strokeWidth="2"
      fill="none"
      key={`${parentNode.props.id}->${childNode.props.id}`}
    />
  );
};
