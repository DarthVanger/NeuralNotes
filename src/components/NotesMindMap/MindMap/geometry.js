import {
  getNodeChildren,
  getLeftNeighbour,
  nodeHasChildren,
  getLeftSideSiblings,
  getParentNode,
  getDeepestFirstChild,
  getDeepestLastChild,
  isRootNode,
} from 'helpers/graph';

/**
 * Get the angle width of a diameter of a circle drawn around a node,
 * the circle diameter is taken as node width.
 * Polar coordinates origin is at parent node.
 */
export const getAngleWidth = node => {
  const { width, radiusAroundParent } = node;

  const margin = 15;

  // Radius of a circle drawn around the node
  const R = (width + margin) / 2;

  /**
   *                              .
   *
   *           .
   *                                                        .  <--- circle around parent
   *
   *
   *                          ----------
   *    .                     | parent |
   *                          ------------------------------- .
   *                               |\ \
   *                               | \     \
   *    1/2 angleWidth             |︶ \        \
   *    --------------------------- ^    \       .   \
   *                               |       \            . \.
   *                               |         \          /         radiusAroundParent
   *        radiusAroundParent --> | .        \  <-----------.-----------------
   *           .                   |            \   /
   *                               |            _ .             .
   *                               |      R _     ^
   *                  .            .    _      child node center
   *                             . |_                        .  <---- child circle, R = 1/2 node width
   *                                   .
   *                                        .           .
   *                                              .
   *
   *
   *
   * Use law of cosines to find the angle between node center and the
   * point where the circle around the node intersects with the circle around
   * the parent node, along which the children are rendered.
   */
  const angleWidth =
    2 *
    Math.acos(
      (2 * radiusAroundParent * radiusAroundParent - R * R) /
        (2 * radiusAroundParent * radiusAroundParent),
    );

  return angleWidth;
};

export const getDistanceBetweenNodes = (node1, node2) => {
  return Math.sqrt(
    Math.pow(node2.x - node1.x, 2) + Math.pow(node2.y - node1.y, 2),
  );
};

export const updatePolarAngle = (graph, node, newφ) => {
  const parentNode = getParentNode(graph, node);

  const newy = parentNode.y + node.radiusAroundParent * Math.sin(newφ);
  const newx = parentNode.x + node.radiusAroundParent * Math.cos(newφ);

  Object.assign(node, {
    φ: newφ,
    x: newx,
    y: newy,
  });
};

/**
 * Calculate angle between two rays (vectors):
 * vector 1: vertex -> node1
 * vector 2: vertex -> node2
 * So the angle between lines drawn from the vertex to node1 and with node2.
 *
 * Formula:
 * Each node has x and y, so basically we have 3 points.
 * Calculate vector coordinates from vertex to both nodes,
 * and then find the angle between vectors using dot product
 * divided by vectors' magnitudes.
 */
export const getAngleBetweenNodes = ({ vertex, node1, node2 }) => {
  const v1 = { x: node1.x - vertex.x, y: node1.y - vertex.y };
  const v2 = {
    x: node2.x - vertex.x,
    y: node2.y - vertex.y,
  };

  const v1Magnitude = Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2));
  const v2Magnitude = Math.sqrt(Math.pow(v2.x, 2) + Math.pow(v2.y, 2));
  let cos = (v1.x * v2.x + v1.y * v2.y) / v1Magnitude / v2Magnitude;

  if (cos > 1 && cos < 1.000001) {
    cos = 1;
  }

  const angle = Math.acos(cos);

  return angle;
};

/**
 * Calculate angle width of a node with all its decendants, in respect to
 * the node's parent. I.e. the angle that node together with its tree occupies.
 *
 * Algorithm:
 * Get angle between the node and its deepest first child, with vertex being
 * the node's parent. Do the same for the deepest last child. Then take max
 * of the two angles.
 * Also, add those deepeset children angle width halved, as angle between nodes is
 * calculated between node centers.
 * So basically we calculate the angles to the left and right edges of the node tree,
 * as deepest children are always at the longest distance from the ray connecting
 * the node of interest with its parent.
 */
export const getAngleWidthOfNodeTree = (graph, node) => {
  const parentNode = getParentNode(graph, node);
  const nodeChildren = getNodeChildren(graph, node);
  const deepestFirstChild = getDeepestFirstChild(graph, node);
  const deepestLastChild = getDeepestLastChild(graph, node);

  const nodeAngleWidth = getAngleWidth(node);

  if (nodeChildren.length === 0) {
    return nodeAngleWidth;
  }

  const angleBetweenNodeAndDeepestFirstChild = getAngleBetweenNodes({
    vertex: parentNode,
    node1: node,
    node2: deepestFirstChild,
  });

  const angleWidthOfDeepestFirstChild = getAngleWidth({
    width: deepestFirstChild.width,
    radiusAroundParent: getDistanceBetweenNodes(parentNode, deepestFirstChild),
  });

  const angleOfTheDeepestFirstChild =
    angleBetweenNodeAndDeepestFirstChild + angleWidthOfDeepestFirstChild / 2;

  const angleBetweenNodeAndDeepestLastChild = getAngleBetweenNodes({
    vertex: parentNode,
    node1: node,
    node2: deepestLastChild,
  });

  const angleWidthOfDeepestLastChild = getAngleWidth({
    width: deepestLastChild.width,
    radiusAroundParent: getDistanceBetweenNodes(parentNode, deepestLastChild),
  });

  const angleOfTheDeepestLastChild =
    angleBetweenNodeAndDeepestLastChild + angleWidthOfDeepestLastChild / 2;

  // take twice the biggest half, instead of a simple sum, in order to keep it symmetrical
  const decendantsAngleWidth =
    Math.max(angleOfTheDeepestFirstChild, angleOfTheDeepestLastChild) * 2;

  // if the node has only 1 child, its angle width might be smaller than the node's width itself
  const angleWidthOfTheNodeTree = Math.max(
    decendantsAngleWidth,
    nodeAngleWidth,
  );

  return angleWidthOfTheNodeTree;
};

/**
 * Calculate radius around the node, that will fit all its decendants,
 * based on their angle width and the current childrenRadius of the node.
 */
export const getRadiusToFitAllDecendants = (graph, node) => {
  const maxAllowedAngleWidth = isRootNode(graph, node) ? 2 * Math.PI : Math.PI;

  const nodeChildren = getNodeChildren(graph, node);
  const totalAngleWidthOfDecendants = nodeChildren.reduce(
    (acc, curr) => acc + curr.treeAngleWidth,
    0,
  );

  const currentCircleLength = totalAngleWidthOfDecendants * node.childrenRadius;

  const maxCircleLength = maxAllowedAngleWidth * node.childrenRadius;

  const fitRadius =
    node.childrenRadius * (currentCircleLength / maxCircleLength);

  return fitRadius;
};
