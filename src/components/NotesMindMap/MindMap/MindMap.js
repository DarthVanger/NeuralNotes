import React from 'react';
import { Node } from './Node';
import { Edge } from './Edge';
import MindMapContainer from './MindMapContainer';
import { getNodeChildren, getRootNode, getLeftNeighbour } from 'helpers/graph';
import { getTextWidth } from './utils';
import {
  getAngleWidth,
  updateNodePositionAroundParent,
  getAngleWidthOfNodeTree,
  centerChildrenAndDecendants,
  updateNodeTreePositionAroundParent,
  increaseRadiusToFitAllDecendantsIfNeeded,
} from './geometry';

export { Node, Edge };

const center = 0;
const nodePadding = 8;
const nodeHeight = 14 + nodePadding * 2;
const fontSize = 16;
const defaultNodeChildrenRadius = 250;

const calculateNodeWidth = node =>
  getTextWidth(node.label, fontSize) + nodePadding * 2;

const MindMap = ({
  nodes: nodesProp,
  edges: edgesProp,
  focusNodeId,
  debug,
  ...attrs
}) => {
  const nodes = nodesProp.map(nodeConfig => {
    const { id, key, label, ...domAttributes } = nodeConfig;
    const width = calculateNodeWidth(nodeConfig);

    return {
      id,
      key,
      label,
      width,
      domAttributes,
    };
  });

  const edges = [...edgesProp];

  const graph = { nodes, edges };

  /**
   * Render children of a node recursively
   */
  const renderNodeChildrenRecursive = parentNode => {
    const nodeChildren = getNodeChildren(graph, parentNode);

    if (!nodeChildren.length) {
      return;
    }

    const isRootNode = getRootNode(graph).id === parentNode.id;

    nodeChildren.forEach((n, nodeIndex) => {
      // Edge from the parent to the current node
      const edge = edges.find(e => e.to === n.id);

      n.parent = parentNode;
      n.height = nodeHeight;
      n.padding = nodePadding;
      n.debug = debug;

      edge.parentNode = parentNode;
      edge.childNode = n;
      edge.debug = debug;

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
       */

      parentNode.childrenRadius = defaultNodeChildrenRadius;

      n.radiusAroundParent = parentNode.childrenRadius;

      n.angleWidth = getAngleWidth(n);

      const leftNeighbour = getLeftNeighbour({ nodes, edges }, n);

      const φ = leftNeighbour?.φ || parentNode.φ;

      updateNodePositionAroundParent({ nodes, edges }, n, φ);

      renderNodeChildrenRecursive(n);

      n.treeAngleWidth = getAngleWidthOfNodeTree(graph, n);

      const angleDistanceToLeftNeighbour = !leftNeighbour
        ? 0
        : leftNeighbour.treeAngleWidth / 2 + n.treeAngleWidth / 2;

      const newφ = φ - angleDistanceToLeftNeighbour;

      updateNodeTreePositionAroundParent(graph, n, newφ);

      if (nodeIndex === nodeChildren.length - 1) {
        increaseRadiusToFitAllDecendantsIfNeeded(graph, parentNode);

        if (!isRootNode) {
          centerChildrenAndDecendants(graph, parentNode);
        }
      }
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
    debug,
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
