import React from 'react';
import { Node } from './Node';
import { Edge } from './Edge';
import MindMapContainer from './MindMapContainer';
import {
  getNodeChildren,
  nodeHasChildren,
  doesNeighbourHaveChildren,
  getRootNode,
  getLeftNeighbour,
} from 'helpers/graph';
import { getTextWidth } from './utils';
import { getAngleWidth, getDistanceBetweenNodes } from './geometry';

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

  const getNodeElementAttributes = node => {
    const nodeConfig = nodesProp.find(
      nodeFromProps => nodeFromProps.id === node.id,
    );
    const nodeElementAttributes = { ...nodeConfig };
    delete nodeElementAttributes.label;
    return nodeElementAttributes;
  };

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
       *  angleToLeftNeighbour      /   \    \
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
       * - Subtract (allSiblingsAngleWidth / 2), so children are centered around the parent.φ.
       * - Add "angleToLeftNeighbour", which is left neighbour angle width halved, plus
       *   the current node angle width halved. So the nodes will be rendered next to each
       *   other on a cricle arch, without overlapping.
       */

      /**
       * Radius around the parent node
       */
      const radius = calculateRadius(nodeChildren, n);

      // TODO: it should be radius for this node children,
      // not this node radius around its parent.
      n.childrenRadius = radius;

      const siblings = getNodeChildren(graph, parentNode);

      const allSiblingsAngleWidth = siblings.reduce((acc, curr) => {
        curr.width = calculateNodeWidth(curr);
        curr.radius = radius;
        const angleWidth = getAngleWidth(curr);
        return acc + angleWidth;
      }, 0);

      const leftNeighbour = getLeftNeighbour({ nodes, edges }, n);
      const leftNeighbourAngleWidth = leftNeighbour
        ? getAngleWidth(leftNeighbour)
        : 0;

      const nodeWidth = calculateNodeWidth(n);

      const nodeAngleWidth = getAngleWidth({
        width: nodeWidth,
        radius: radius,
      });

      const angleToLeftNeighbour =
        leftNeighbourAngleWidth / 2 + nodeAngleWidth / 2;

      const startAngle = parentNode.φ + allSiblingsAngleWidth / 2;

      const φ = (leftNeighbour?.φ || startAngle) - angleToLeftNeighbour;

      const y = center + parentNode.y + radius * Math.sin(φ);
      const x = center + parentNode.x + radius * Math.cos(φ);

      Object.assign(n, {
        x,
        y,
        φ,
        radius,
        width: nodeWidth,
        height: nodeHeight,
        padding: nodePadding,
        angleWidth: nodeAngleWidth,
        parent: parentNode,
        elementAttributes: getNodeElementAttributes(n),
      });

      Object.assign(edge, {
        parentNode: parentNode,
        childNode: n,
      });

      /* prevent children of sibling nodes from overlapping,
       * by increasing the distance between siblings to make
       * space for their children.
       */

      const getShiftToMakeSpaceForChildren = node => {
        const children = getNodeChildren(graph, node);
        if (children.length === 0) return 0;

        const leftNeighbour = getLeftNeighbour({ nodes, edges }, node);
        if (!leftNeighbour) return 0;

        if (nodeHasChildren(graph, leftNeighbour)) {
          const distanceBetweenNodes = getDistanceBetweenNodes(
            node,
            leftNeighbour,
          );
          if (distanceBetweenNodes < node.childrenRadius) {
            const shift = node.childrenRadius - distanceBetweenNodes;
            const angleShift = getAngleWidth({
              width: shift,
              radius: node.radius,
            });
            return angleShift;
          }
        }
      };

      const shiftToMakeSpaceForChildren = getShiftToMakeSpaceForChildren(n);

      const newφ = φ - shiftToMakeSpaceForChildren;

      const newy = center + parentNode.y + radius * Math.sin(newφ);
      const newx = center + parentNode.x + radius * Math.cos(newφ);

      Object.assign(n, {
        φ: newφ,
        x: newx,
        y: newy,
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
    elementAttributes: getNodeElementAttributes(rootNode),
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
