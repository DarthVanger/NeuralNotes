import React from 'react';
import { Node } from './Node';
import { Edge } from './Edge';
import MindMapContainer from './MindMapContainer';
import { nodeHasChildren, doesNeighbourHaveChildren } from 'helpers/graph';

export { Node, Edge };

const center = 0;
const nodePadding = 8;
const nodeHeight = 14 + nodePadding * 2;

const calculateNodeWidth = Node =>
  getTextWidth(Node.props.label) + nodePadding * 2;

const MindMap = ({ nodes, edges, focusNodeId, ...attrs }) => {
  let mindMapNodes = [];
  const edgeElements = [];

  const graph = {
    nodes: nodes.map(node => ({
      id: node.props.id,
      label: node.props.label,
    })),
    edges: edges.map(edge => ({
      from: edge.props.from,
      to: edge.props.to,
    })),
  };

  const getNodeChildren = node =>
    edges
      .filter(e => e.props.from === node.props.id)
      .map(e => nodes.find(n => e.props.to === n.props.id));

  /**
   * Default radius is a hard-coded value.
   * But when two neighbour nodes have children, more space is needed to avoid overlap.
   */
  function calculateRadius(nodeChildren, n) {
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
    const nodeChildren = getNodeChildren(parentNode);

    if (!nodeChildren.length) {
      return;
    }

    const isRootNode =
      getRootNode(nodes, edges).props.id === parentNode.props.id;

    const nodeChildrenElements = nodeChildren.map((n, i) => {
      const rootNodeChildrenShift = (2 * 3.14) / nodeChildren.length;
      const nonRootNodeChildrenShift = 3.14 / 2 / nodeChildren.length;
      const shift = isRootNode
        ? rootNodeChildrenShift
        : nonRootNodeChildrenShift;

      const edge = edges.find(e => e.props.to === n.props.id);

      const φ =
        i * shift +
        (parentNode?.props.φ || 0) -
        (nodeChildren.length * shift) / 2;

      const radius = calculateRadius(nodeChildren, n);

      const parentNodeWidth =
        getTextWidth(parentNode.props.label) + nodePadding * 2;

      const c = center;
      const y = center + parentNode.props.y + radius * Math.sin(φ);
      const x =
        center + (parentNode.props.x + parentNodeWidth) + radius * Math.cos(φ);

      const NodeElement = React.cloneElement(n, {
        x,
        y,
        φ,
        radius,
        width: calculateNodeWidth(n),
        height: nodeHeight,
        padding: nodePadding,
      });

      const EdgeElement = React.cloneElement(edge, {
        parentNode: parentNode,
        childNode: NodeElement,
      });

      edgeElements.push(EdgeElement);

      return NodeElement;
    });

    mindMapNodes.push(...nodeChildrenElements);

    nodeChildrenElements.forEach(levelNode => {
      renderNodeChildren(levelNode);
    });
  };

  const rootNode = getRootNode(nodes, edges);

  const RootNodeElement = React.cloneElement(rootNode, {
    x: center,
    y: center,
    φ: 0,
    radius: 0,
    width: calculateNodeWidth(rootNode),
    height: nodeHeight,
    padding: nodePadding,
  });

  mindMapNodes.push(RootNodeElement);

  renderNodeChildren(RootNodeElement);

  function getRootNode(nodes, edges) {
    return getParent(nodes[0]);

    function getParent(node) {
      const parentId = edges.find(e => e.props.to === node.props.id)?.props
        .from;
      if (!parentId) {
        return node;
      }

      const parentNode = nodes.find(n => n.props.id === parentId);
      return getParent(parentNode);
    }
  }

  const maxX = Math.max(...mindMapNodes.map(n => Math.abs(n.props.x)));
  const maxY = Math.max(...mindMapNodes.map(n => Math.abs(n.props.y)));

  // TODO: take width of the node with the max X position,
  // instead of just the widest node on the mind map.
  const maxNodeWidth = Math.max(...mindMapNodes.map(n => n.props.width));

  const mindMapPadding = 15;
  const svgSize = 2 * Math.max(maxX, maxY) + mindMapPadding * 2 + maxNodeWidth;

  const focusNode = mindMapNodes.find(n => n.props.id == focusNodeId);
  const initialFocusPosition = {
    x: svgSize / 2 + (focusNode?.props.x || 0),
    y: svgSize / 2 + (focusNode?.props.y || 0),
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

// https://stackoverflow.com/questions/31305071/measuring-text-width-height-without-rendering
function getTextWidth(txt) {
  const element = document.createElement('canvas');
  const context = element.getContext('2d');
  const font = window
    .getComputedStyle(document.body)
    .getPropertyValue('font-family');
  context.font = '16px ' + font;
  return context.measureText(txt).width;
}

export default MindMap;
