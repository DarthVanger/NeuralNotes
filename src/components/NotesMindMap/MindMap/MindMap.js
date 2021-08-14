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
const nodePadding = 14;
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
    const { id, key, label, customAttributes, ...domAttributes } = nodeConfig;
    const width = calculateNodeWidth(nodeConfig);

    return {
      id,
      key,
      label,
      width,
      customAttributes,
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

  const focusNode = nodes.find(n => n.id == focusNodeId);
  const focusPosition = {
    x: focusNode.x,
    y: focusNode.y,
  };

  return (
    <MindMapContainer focusPosition={focusPosition} {...attrs}>
      {edges.map(edge => (
        <Edge {...edge} key={`${edge.parentNode.id}->${edge.childNode.id}`} />
      ))}
      {nodes.map(node => (
        <Node {...node} key={node.id} />
      ))}
    </MindMapContainer>
  );
};

export default MindMap;
