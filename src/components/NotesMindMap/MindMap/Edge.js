import React from 'react';
export const Edge = ({ parentNode, childNode }) => {
  const colorSeed = parentNode.x * parentNode.y;
  const randomColor = `rgb(${(colorSeed * 50) % 255}, ${(colorSeed * 100) %
    255}, ${(colorSeed * 150) % 255})`;

  /**
   * Straight line from parent to child, taking into account nodes width & height.
   */
  const svgPathShape = `
    M ${parentNode.x + parentNode.width / 2} ${parentNode.y -
    parentNode.height / 2}
    L ${childNode.x + childNode.width / 2} ${childNode.y - childNode.height / 2}
  `;

  return (
    <path
      d={svgPathShape}
      stroke={randomColor}
      strokeWidth="2"
      fill="none"
      key={`${parentNode.id}->${childNode.id}`}
    />
  );
};
