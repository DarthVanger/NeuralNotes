import React from 'react';
import { Node } from './Node';
import { Edge } from './Edge';
import MindMapContainer from './MindMapContainer';
import {
  getNodeChildren,
  nodeHasChildren,
  doesNeighbourHaveChildren,
  getRootNode,
} from 'helpers/graph';
import { getTextWidth } from './utils';

export { Node, Edge };

const center = 0;
const nodePadding = 8;
const nodeHeight = 14 + nodePadding * 2;
const fontSize = 16;

const calculateNodeWidth = node =>
  getTextWidth(node.label, fontSize) + nodePadding * 2;

const MindMap = ({
  nodes: nodesProp,
  edges: edgesProp,
  focusNodeId,
  ...attrs
}) => {
  const nodes = [...nodesProp];
  const edges = [...edgesProp];

  const graph = { nodes, edges };

  /**
   * Default radius is a hard-coded value.
   * But when two neighbour nodes have children, more space is needed to avoid overlap.
   */
  function calculateRadius(n) {
    const defaultRadius = 250;
    if (nodeHasChildren(graph, n) && doesNeighbourHaveChildren(graph, n)) {
      return defaultRadius * 2;
    }
    return defaultRadius;
  }

  /**
   * Render children of a node recursively
   */
  const renderNodeChildrenRecursive = parentNode => {
    const nodeChildren = getNodeChildren(graph, parentNode);

    if (!nodeChildren.length) {
      return;
    }

    const isRootNode = getRootNode(graph).id === parentNode.id;

    nodeChildren.forEach((n, i) => {
      // Edge from the parent to the current node
      const edge = edges.find(e => e.to === n.id);

      const rootNodeChildrenAngleBetweenChildNodes =
        (2 * 3.14) / nodeChildren.length;

      const nonRootNodeChildrenAngleBetweenChildNodes =
        3.14 / 2 / nodeChildren.length;

      const angleBetweenChildNodes = isRootNode
        ? rootNodeChildrenAngleBetweenChildNodes
        : nonRootNodeChildrenAngleBetweenChildNodes;

      /**
       *                    ---------------
       *                    | grandparent |
       *                    ---------------
       *                          \ ) parentNode.φ
       *                           \
       *                            \
       *                          ----------
       *                          | parent |
       *                          -----------------------------------
       *                               /\ \    ) φ of the first child
       *  angleBetweenChildNodes     /   \    \
       *          |                /   ︶ \       \
       *          |              /     ^   \          \
       *          -------------/-------|    \              \
       *                     /               \                 \
       *                   /                  \                    \
       *            --------------             \             ---------------
       *            | last child |              \            | first child |
       *            --------------      -----------------    ---------------
       *                                | middle child  |
       *                                -----------------
       *
       *
       * φ is the polar coordinates angle, with the center placed at the parent node.
       *
       * φ is calculated for each child node as follows:
       * - Start with parentNode.φ, so the parent line continues in the same direction.
       * - Add the child index multiplied by angleBetweenChildNodes constant,
       *   so the nodes will go around the parent node one by one in a circle arch.
       * - Subtract the angle between the first and last child, divided by two,
       *   so that the middle child will have φ equal to the parentNode.φ
       *   (instead of the first child (i=0) having φ equal to the parentNode.φ).
       */

      const isASingleChild = nodeChildren.length === 1;

      const angleBetweenFirstAndLastChild = isASingleChild
        ? 0
        : nodeChildren.length * angleBetweenChildNodes;

      const childAngle =
        i * angleBetweenChildNodes - angleBetweenFirstAndLastChild / 2;

      const φ = parentNode.φ + childAngle;

      /**
       * Radius around the parent node
       */
      const radius = calculateRadius(nodeChildren, n);

      const parentNodeWidth =
        getTextWidth(parentNode.label, fontSize) + nodePadding * 2;

      const y = center + parentNode.y + radius * Math.sin(φ);
      const x = center + parentNode.x + radius * Math.cos(φ);

      Object.assign(n, {
        x,
        y,
        φ,
        radius,
        width: calculateNodeWidth(n),
        height: nodeHeight,
        padding: nodePadding,
      });

      Object.assign(edge, {
        parentNode: parentNode,
        childNode: n,
      });

      renderNodeChildrenRecursive(n);
    });
  };

  const rootNode = getRootNode(graph);

  Object.assign(rootNode, {
    x: center,
    y: center,
    φ: 0,
    radius: 0,
    width: calculateNodeWidth(rootNode),
    height: nodeHeight,
    padding: nodePadding,
  });

  renderNodeChildrenRecursive(rootNode);

  const maxX = Math.max(...nodes.map(n => Math.abs(n.x)));
  const maxY = Math.max(...nodes.map(n => Math.abs(n.y)));

  // TODO: take width of the node with the max X position,
  // instead of just the widest node on the mind map.
  const maxNodeWidth = Math.max(...nodes.map(n => n.width));

  const mindMapPadding = 15;
  const svgSize = 2 * Math.max(maxX, maxY) + mindMapPadding * 2 + maxNodeWidth;

  const focusNode = nodes.find(n => n.id == focusNodeId);
  const initialFocusPosition = {
    x: svgSize / 2 + (focusNode?.x || 0),
    y: svgSize / 2 + (focusNode?.y || 0),
  };
  return (
    <MindMapContainer initialFocusPosition={initialFocusPosition}>
      <svg
        viewBox={`${-svgSize / 2} ${-svgSize / 2} ${svgSize} ${svgSize}`}
        width={svgSize}
        height={svgSize}
        {...attrs}>
        {edges.map(edge => (
          <Edge {...edge} key={`${edge.parentNode.id}->${edge.childNode.id}`} />
        ))}
        {nodes.map(node => (
          <Node {...node} key={node.id} />
        ))}
      </svg>
    </MindMapContainer>
  );
};

export default MindMap;
