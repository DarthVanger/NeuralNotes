import React from 'react';

export const Edge = ({ parentNode, childNode }) => {
  const hue = Math.floor(Math.abs((parentNode.φ % (Math.PI / 2)) * 345));
  const randomColor = `hsl(${hue}, 100%, 70%)`;

  /**
   * Straight line from center of parent to center of child
   */
  const svgPathShape = `
    M ${parentNode.x} ${parentNode.y}
    L ${childNode.x} ${childNode.y}
  `;

  return (
    <>
      <path
        d={svgPathShape}
        stroke={randomColor}
        strokeWidth="2"
        fill="none"
        key={`${parentNode.id}->${childNode.id}3`}
      />
    </>
  );
};
