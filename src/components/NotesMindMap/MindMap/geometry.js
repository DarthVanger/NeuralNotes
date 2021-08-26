import {
  getNodeChildren,
  getLeftNeighbour,
  isRootNode,
  getParentNode,
  getTreeLeaves,
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

export const updateNodePositionAroundParent = (graph, node, newφ) => {
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
 * Update node's position around parent with new φ and also move all its decendants.
 */
export const updateNodeTreePositionAroundParent = (graph, node, newφ) => {
  const deltaφ = newφ - node.φ;

  const rotateRecursively = nodeToRotate => {
    updateNodePositionAroundParent(
      graph,
      nodeToRotate,
      nodeToRotate.φ + deltaφ,
    );
    getNodeChildren(graph, nodeToRotate).forEach(child => {
      rotateRecursively(child);
    });
  };

  rotateRecursively(node);
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
  const nodeAngleWidth = node.angleWidth;

  if (nodeChildren.length === 0) {
    return nodeAngleWidth;
  }

  const treeLeaves = getTreeLeaves(graph, node);

  let maxLeafAngle = 0;
  let leafWithMaxAngle = treeLeaves[0];
  treeLeaves.forEach(leaf => {
    const leafAngle = getAngleBetweenNodes({
      vertex: parentNode,
      node1: node,
      node2: leaf,
    });
    if (maxLeafAngle < leafAngle) {
      maxLeafAngle = leafAngle;
      leafWithMaxAngle = leaf;
    }
  });

  const angleWidthOfLeafWithMaxAngle = getAngleWidth({
    width: leafWithMaxAngle.width,
    radiusAroundParent: getDistanceBetweenNodes(parentNode, leafWithMaxAngle),
  });

  const leafAngle = maxLeafAngle + angleWidthOfLeafWithMaxAngle / 2;

  const decendantsAngleWidth = leafAngle * 2;

  // if the node has only 1 child, its angle width might be smaller than the node's width itself
  const angleWidthOfTheNodeTree = Math.max(
    decendantsAngleWidth,
    nodeAngleWidth,
  );

  return angleWidthOfTheNodeTree;
};

/**
 * Find the radius for a circle to render children along,
 * such that fits all node children and decendants without overlapping.
 * Using binary search, as it's hard to define a formula.
 */
export const increaseRadiusToFitAllDecendantsIfNeeded = (graph, node) => {
  const maxAllowedAngleWidth = isRootNode(graph, node) ? 2 * Math.PI : Math.PI;
  const currentAngleWidth = getTotalAngleWidthOfDecendants(graph, node);

  if (currentAngleWidth < maxAllowedAngleWidth) return;

  // just in case of a bug, to prevent infinite loop :)
  const maxIterations = 100;
  let binarySearchIteration = 0;

  let lowerBound = node.childrenRadius;

  // First, find the upper bound for fit radius, as it's hard to define it by a formula.
  let upperBound =
    node.childrenRadius * (currentAngleWidth / maxAllowedAngleWidth);
  while (binarySearchIteration < maxIterations) {
    binarySearchIteration++;
    updateChildrenRadiusAndDecendants(graph, node, upperBound);
    const currentAngleWidth = getTotalAngleWidthOfDecendants(graph, node);
    if (currentAngleWidth < maxAllowedAngleWidth) {
      break;
    }

    // Since this upperBound is still too small, we can use it as a refined lower bound :)
    lowerBound = upperBound;

    upperBound = upperBound * 2;
  }

  // Now do the binary search to find the radius that will fit nicely, between lower and upper bound
  let fitRadius;
  const fitAllowance = 5 * (Math.PI / 180);
  while (binarySearchIteration < maxIterations) {
    binarySearchIteration++;

    if (binarySearchIteration >= maxIterations) {
      throw new Error(
        `Failed to find radius to fit all node children on mind map for node "${node.name}" (infinite loop)`,
      );
    }

    const mid = (lowerBound + upperBound) / 2;

    updateChildrenRadiusAndDecendants(graph, node, mid);
    const currentAngleWidth = getTotalAngleWidthOfDecendants(graph, node);

    if (currentAngleWidth > maxAllowedAngleWidth) {
      lowerBound = mid;
      continue;
    }

    if (maxAllowedAngleWidth - currentAngleWidth < fitAllowance) {
      fitRadius = mid;
      break;
    }

    upperBound = mid;
  }

  return fitRadius;
};

export const getTotalAngleWidthOfDecendants = (graph, node) => {
  const nodeChildren = getNodeChildren(graph, node);
  return nodeChildren.reduce((acc, curr) => acc + curr.treeAngleWidth, 0);
};

/**
 * Initially children are rendered starting from parent.φ, going counterclockwise.
 * So they aren't centered around the parent.φ.
 * This function centers the children around the parent.φ, by rotating them by
 * half of their total angle (angle is taken between the centers of the
 * first and the last node).
 * Also rotates all the decendants.
 */
export const centerChildrenAndDecendants = (graph, node) => {
  const nodeChildren = getNodeChildren(graph, node);
  const firstChild = nodeChildren[0];
  const lastChild = nodeChildren[nodeChildren.length - 1];

  const angleBetweenCentersOfTheFirstAndLastChildren =
    getTotalAngleWidthOfDecendants(graph, node) -
    firstChild.treeAngleWidth / 2 -
    lastChild.treeAngleWidth / 2;

  const centeringShift = angleBetweenCentersOfTheFirstAndLastChildren / 2;

  nodeChildren.forEach(node => {
    updateNodeTreePositionAroundParent(graph, node, node.φ + centeringShift);
  });
};

/**
 * Update node's childrenRadius and reposition its children accordingly,
 * also moving all their decendants.
 */
export const updateChildrenRadiusAndDecendants = (graph, node, newRadius) => {
  node.childrenRadius = newRadius;

  const nodeChildren = getNodeChildren(graph, node);

  nodeChildren.forEach(child => {
    child.radiusAroundParent = newRadius;
    child.angleWidth = getAngleWidth(child);
    updateNodeTreePositionAroundParent(graph, child, child.φ);

    child.treeAngleWidth = getAngleWidthOfNodeTree(graph, child);

    const leftNeighbour = getLeftNeighbour(graph, child);
    const φ = !leftNeighbour
      ? node.φ
      : leftNeighbour.φ -
        (leftNeighbour.treeAngleWidth / 2 + child.treeAngleWidth / 2);

    updateNodeTreePositionAroundParent(graph, child, φ);
  });
};
