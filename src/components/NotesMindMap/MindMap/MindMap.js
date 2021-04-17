import React from 'react';
import { Node } from './Node';
import { Edge } from './Edge';
import MindMapContainer from './MindMapContainer';
import {
  getNodeChildren,
  nodeHasChildren,
  doesNeighbourHaveChildren,
} from 'helpers/graph';
import { getTextWidth } from './utils';

export { Node, Edge };

const center = 0;
const nodePadding = 8;
const nodeHeight = 14 + nodePadding * 2;
const fontSize = 16;

const calculateNodeWidth = node =>
  getTextWidth(node.label, fontSize) + nodePadding * 2;

const MindMap = ({ nodes, edges, focusNodeId, ...attrs }) => {
  let mindMapNodes = [];
  const edgeElements = [];

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
   * Render children of a node
   */
  const renderNodeChildren = parentNode => {
    const nodeChildren = getNodeChildren(graph, parentNode);

    if (!nodeChildren.length) {
      return;
    }

    const isRootNode = getRootNode(nodes, edges).id === parentNode.id;

    const nodeChildrenElements = nodeChildren.map((n, i) => {
      const rootNodeChildrenShift = (2 * 3.14) / nodeChildren.length;
      const nonRootNodeChildrenShift = 3.14 / 2 / nodeChildren.length;
      const shift = isRootNode
        ? rootNodeChildrenShift
        : nonRootNodeChildrenShift;

      const edge = edges.find(e => e.to === n.id);

      const φ =
        i * shift + (parentNode?.φ || 0) - (nodeChildren.length * shift) / 2;

      const radius = calculateRadius(nodeChildren, n);

      const parentNodeWidth =
        getTextWidth(parentNode.label, fontSize) + nodePadding * 2;

      const c = center;
      const y = center + parentNode.y + radius * Math.sin(φ);
      const x =
        center + (parentNode.x + parentNodeWidth) + radius * Math.cos(φ);

      const nodeProps = {
        ...n,
        x,
        y,
        φ,
        radius,
        width: calculateNodeWidth(n),
        height: nodeHeight,
        padding: nodePadding,
      };

      Object.assign(n, nodeProps);

      const NodeElement = <Node {...nodeProps} />;

      const edgeProps = {
        ...edge,
        parentNode: parentNode,
        childNode: n,
      };

      const EdgeElement = <Edge {...edgeProps} />;

      edgeElements.push(EdgeElement);

      return NodeElement;
    });

    mindMapNodes.push(...nodeChildrenElements);

    nodeChildren.forEach(levelNode => {
      renderNodeChildren(levelNode);
    });
  };

  const rootNode = getRootNode(nodes, edges);

  const rootNodeProps = {
    ...rootNode,
    x: center,
    y: center,
    φ: 0,
    radius: 0,
    width: calculateNodeWidth(rootNode),
    height: nodeHeight,
    padding: nodePadding,
  };

  Object.assign(rootNode, rootNodeProps);

  const RootNodeElement = <Node {...rootNodeProps} />;

  mindMapNodes.push(RootNodeElement);

  renderNodeChildren(rootNode);

  function getRootNode(nodes, edges) {
    return getParent(nodes[0]);

    function getParent(node) {
      const parentId = edges.find(e => e.to === node.id)?.from;
      if (!parentId) {
        return node;
      }

      const parentNode = nodes.find(n => n.id === parentId);
      return getParent(parentNode);
    }
  }

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
        {edgeElements}
        {mindMapNodes}
      </svg>
    </MindMapContainer>
  );
};

export default MindMap;
