import React from 'react';
import { getNodeCircularEdges } from './geometry';

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

  const { startEdge, endEdge } = getNodeCircularEdges(childNode);

  const debugLines = () => {
    const pathToCenter = `
      M ${parentNode.x} ${parentNode.y}
      L ${childNode.x} ${childNode.y}
    `;

    const pathToStartCorner = `
      M 0 0
      L ${startEdge.x} ${startEdge.y}
    `;

    const pathToEndCorner = `
      M 0 0
      L ${endEdge.x} ${endEdge.y}
    `;

    return (
      <>
        <path
          d={pathToCenter}
          stroke={randomColor}
          strokeWidth="2"
          fill="none"
          strokeDasharray="2"
          key={`${parentNode.id}->${childNode.id}3`}
        />

        <path
          d={pathToStartCorner}
          stroke={randomColor}
          strokeWidth="2"
          fill="none"
          strokeDasharray="12"
          key={`${parentNode.id}->${childNode.id}`}
        />

        <path
          d={pathToEndCorner}
          stroke={randomColor}
          strokeWidth="2"
          strokeDasharray="4"
          fill="none"
          key={`${parentNode.id}->${childNode.id}2`}
        />
      </>
    );
  };

  return (
    <path
      d={svgPathShape}
      stroke={randomColor}
      strokeWidth="2"
      fill="none"
      key={`${parentNode.id}->${childNode.id}3`}
    />
  );
};
