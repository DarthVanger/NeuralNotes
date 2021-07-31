import {
  getNodeChildren,
  getLeftNeighbour,
  nodeHasChildren,
  getLeftSideSiblings,
} from 'helpers/graph';

/**
 * Get the angle width of a diameter of a circle drawn around a node,
 * the circle diameter is taken as node width.
 * Polar coordinates origin is at parent node.
 */
export const getAngleWidth = node => {
  const { width, radius: parentRadius } = node;

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
   *                               |         \          /         parentRadius
   *              parentRadius --> | .        \  <-----------.-----------------
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
      (2 * parentRadius * parentRadius - R * R) /
        (2 * parentRadius * parentRadius),
    );

  return angleWidth;
};

/**
 * Get the coordinates of points where a circle drawn around the node
 * intersects with the circle drawn around its parent node.
 * So to say, "edges" of the node on the parent node circle.
 */
export const getNodeCircularEdges = node => {
  const startEdgePhi = node.φ - getAngleWidth(node) / 2;
  const endEdgePhi = node.φ + getAngleWidth(node) / 2;
  const startEdge = {
    x: node.radius * Math.cos(startEdgePhi),
    y: node.radius * Math.sin(startEdgePhi),
  };

  const endEdge = {
    x: node.radius * Math.cos(endEdgePhi),
    y: node.radius * Math.sin(endEdgePhi),
  };

  return { startEdge, endEdge };
};

export const getDistanceBetweenNodes = (node1, node2) => {
  return Math.sqrt(
    Math.pow(node2.x - node1.x, 2) + Math.pow(node2.y - node2.y, 2),
  );
};

/**
 * For each left-side sibling of the node,
 * calculate angle width between node and its sibling,
 * such that children of both nodes would not overlap.
 * Return the max angle width, so no nodes' children overlap.
 *
 * Each node has radius of a circle for rendering its children,
 * so we just need to make sure those circles don't overlap.
 */
export const getShiftToMakeSpaceForChildren = (graph, node) => {
  const children = getNodeChildren(graph, node);
  if (children.length === 0) return 0;

  const leftNeighbour = getLeftNeighbour(graph, node);
  if (!leftNeighbour) return 0;

  const getShiftToMakeSpaceForChildrenBetweenNodeAndSibling = (
    node,
    sibling,
  ) => {
    const siblingHasChildren = nodeHasChildren(graph, sibling);
    if (!siblingHasChildren) return 0;

    const distanceBetweenNodes = getDistanceBetweenNodes(node, leftNeighbour);
    if (distanceBetweenNodes < node.childrenRadius) {
      const shift = node.childrenRadius - distanceBetweenNodes;
      const angleShift = getAngleWidth({
        width: shift,
        radius: node.radius,
      });
      return angleShift;
    }
  };

  const leftSideSiblings = getLeftSideSiblings(graph, node);
  const shifts = leftSideSiblings.map(sibling =>
    getShiftToMakeSpaceForChildrenBetweenNodeAndSibling(node, sibling),
  );
  return Math.max(...shifts);
};
