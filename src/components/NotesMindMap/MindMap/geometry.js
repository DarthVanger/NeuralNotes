import { getParentNode } from 'helpers/graph';

export const getNodeEdgeCornerNames = node => {
  let φ = node.φ;

  if (φ <= 0) φ = 2 * Math.PI + φ;

  if (φ > 0 && φ <= Math.PI / 2)
    return { start: 'topRight', end: 'bottomLeft' };
  if (φ > Math.PI / 2 && φ <= Math.PI)
    return { start: 'bottomRight', end: 'topLeft' };
  if (φ > Math.PI && φ <= (Math.PI * 3) / 2)
    return { start: 'bottomLeft', end: 'topRight' };
  if (φ > (Math.PI * 3) / 2 && φ <= 2 * Math.PI)
    return { start: 'topLeft', end: 'bottomRight' };
};

export const getNodeQuadrant = node => {
  let φ = node.φ;

  if (φ <= 0) φ = 2 * Math.PI + φ;

  if (φ > 0 && φ <= Math.PI / 2) return 1;
  if (φ > Math.PI / 2 && φ <= Math.PI) return 2;
  if (φ > Math.PI && φ <= (Math.PI * 3) / 2) return 3;
  if (φ > (Math.PI * 3) / 2 && φ <= 2 * Math.PI) return 4;
};

export const getNodeEndCorner = node => {
  const { end: endCornerName } = getNodeEdgeCornerNames(node);

  return getNodeCorner(node, endCornerName);
};

/**
 * Get the angle between the bottom left and bottom right corners of a node.
 * Polar coordinates origin is at parent node.
 */
export const getAngleWidth = node => {
  //console.log('node.φ: ', node.φ);
  const relativeNodeX = node.radius * Math.cos(node.φ);
  const relativeNodeY = node.radius * Math.sin(node.φ);
  const startCorner = getNodeCorner(node, getNodeEdgeCornerNames(node).start);
  const endCorner = getNodeCorner(node, getNodeEdgeCornerNames(node).end);
  const startCornerRelative = {
    x: startCorner.x - node.parent.x,
    y: startCorner.y - node.parent.y,
  };
  const endCornerRelative = {
    x: endCorner.x - node.parent.x,
    y: endCorner.y - node.parent.y,
  };

  let startCornerPhi = Math.atan2(startCornerRelative.x, startCornerRelative.y);
  let endCornerPhi = Math.atan2(endCornerRelative.x, endCornerRelative.y);

  if (startCornerPhi > 0) startCornerPhi = -(2 * Math.PI - startCornerPhi);
  if (endCornerPhi > 0) endCornerPhi = -(2 * Math.PI - endCornerPhi);

  console.log('start corner phi: ', startCornerPhi);
  console.log('end corner phi: ', endCornerPhi);

  const angleWidth = Math.abs(endCornerPhi - startCornerPhi); // % (2 * Math.PI);
  console.log(
    `getNodeEdgeCornerNames() (${node.label}): `,
    getNodeEdgeCornerNames(node),
  );
  console.log(`angle Width (${node.label}): `, (angleWidth * 180) / Math.PI);
  return angleWidth;
};

export const getNodeCorner = (node, cornerName) => {
  const { x, y, width, height } = node;

  const quadrant = getNodeQuadrant(node);

  if (quadrant === 4) {
    switch (cornerName) {
      case 'bottomRight':
        return { x, y };
      case 'bottomLeft':
        return { x: x - width, y };
      case 'topLeft':
        return { x: x - width, y: y - height };
      case 'topRight':
        return { x: x, y: y - height };
    }
  }

  if (quadrant === 3) {
    switch (cornerName) {
      case 'bottomRight':
        return { x, y: y + height };
      case 'bottomLeft':
        return { x: x - width, y: y + height };
      case 'topLeft':
        return { x: x - width, y };
      case 'topRight':
        return { x, y };
    }
  }
};
