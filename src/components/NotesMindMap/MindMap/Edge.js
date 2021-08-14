import React from 'react';
import { colors } from 'colors';

export const Edge = ({ parentNode, childNode }) => {
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
        stroke={colors.secondaryColor}
        strokeWidth="2"
        fill="none"
        key={`${parentNode.id}->${childNode.id}3`}
      />
    </>
  );
};
