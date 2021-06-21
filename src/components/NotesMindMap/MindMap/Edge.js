import React from 'react';
import {
  getAngleWidth,
  getNodeEdgeCornerNames,
  getNodeCorner,
} from './geometry';

export const Edge = ({ parentNode, childNode }) => {
  //const colorSeed = parentNode.x * parentNode.y;
  const colorSeed = childNode.x * childNode.y * childNode.φ;
  const hue = Math.floor(Math.abs((childNode.φ % (Math.PI / 2)) * 345));
  //const red = anglePercent;
  //const green = Math.floor(anglePercent % (255 / 8) * 8);
  //const blue = Math.floor((anglePercent + 255 / 8) % (255 / 8) * 8);

  //const randomColor = `rgb(${(colorSeed * 50) % 255}, ${(colorSeed * 100) %
  //  255}, ${(colorSeed * 150) % 255})`;
  //const randomColor = `rgb(${red}, ${green}, ${blue})`;
  const randomColor = `hsl(${hue}, 100%, 70%)`;

  /**
   * Straight line from parent to child, taking into account nodes width & height.
   */
  //const svgPathShape = `
  //  M ${parentNode.x + parentNode.width / 2} ${parentNode.y -
  //  parentNode.height / 2}
  //  L ${childNode.x + childNode.width / 2} ${childNode.y - childNode.height / 2}
  //`;
  //const svgPathShape = `
  //  M ${parentNode.x + parentNode.width / 2 - parentNode.width} ${parentNode.y -
  //  parentNode.height / 2}
  //  L ${childNode.x} ${childNode.y}
  //`;

  const svgPathShape = `
    M ${parentNode.x} ${parentNode.y}
    L ${childNode.x} ${childNode.y}
  `;

  const angleWidth = getAngleWidth(childNode);

  const svgPathShape2 = `
    M 0 0
    L ${parentNode.x +
      childNode.radius * Math.cos(childNode.φ - angleWidth)} ${parentNode.y +
    childNode.radius * Math.sin(childNode.φ - angleWidth)}
  `;

  const edgeCorners = getNodeEdgeCornerNames(childNode);
  const startCorner = getNodeCorner(childNode, edgeCorners.start);
  const endCorner = getNodeCorner(childNode, edgeCorners.end);

  const pathToStartCorner = `
    M 0 0
    L ${startCorner.x} ${startCorner.y}
  `;

  const pathToEndCorner = `
    M 0 0
    L ${endCorner.x} ${endCorner.y}
  `;

  return (
    <>
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
