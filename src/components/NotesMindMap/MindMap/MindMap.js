import React from 'react';
import { Node } from './Node';
import { Edge } from './Edge';
import MindMapContainer from './MindMapContainer';

export { Node, Edge };

const center = 0;
const nodePadding = 8;
const nodeHeight = 14 + nodePadding * 2;

const radius = 250;
const getCirlceRadius = circleNum => {
  if (circleNum < 0) return 0;
  return circleNum * radius;
};

const MindMap = ({ nodes, edges, focusNodeId, ...attrs }) => {
  let circleNum = 1;
  let mindMapNodes = [];
  const edgeElements = [];
  const nodePositions = [];

  let radius = getCirlceRadius(circleNum);

  const getNodeChildren = node =>
    edges
      .filter(e => e.props.from === node.props.id)
      .map(e => nodes.find(n => e.props.to === n.props.id));

  function calculateRadius(nodeChildren, n) {
    if (nodeHasChildren(n) && doesNeighbourHaveChildren(nodeChildren, n)) {
      return 250 * 2;
    }
    return 250;
  }

  function nodeHasChildren(node) {
    const has = edges.find(edge => edge.props.from === node.props.id);
    return has;
  }

  function doesNeighbourHaveChildren(nodeChildren, n) {
    const leftNeighbour = nodeChildren[nodeChildren.indexOf(n) - 1];
    const rightNeighbour = nodeChildren[nodeChildren.indexOf(n) + 1];

    const nodeHasChildren = node =>
      edges.find(edge => edge.props.from === node.props.id);

    if (leftNeighbour && nodeHasChildren(leftNeighbour)) {
      console.log('leftNeighbour has chilren: ', leftNeighbour);
      return true;
    }

    if (rightNeighbour && nodeHasChildren(rightNeighbour)) {
      console.log('rightNeighbour has chilren: ', rightNeighbour);
      return true;
    }

    return false;
  }

  const renderRootChildren = rootNode => {
    const children = getNodeChildren(rootNode);

    const shift = (2 * 3.14) / children.length;

    const nodeElements = children.map((n, i) => {
      radius = calculateRadius(children, n);

      const edge = edges.find(e => e.props.to === n.props.id);

      const φ = i * shift;
      const x = radius * Math.cos(φ);
      const y = radius * Math.sin(φ);

      nodePositions.push({
        id: n.props.id,
        x: x + center,
        y: y + center,
        φ,
      });

      const NodeElement = React.cloneElement(n, {
        x,
        y,
        padding: nodePadding,
        width: getTextWidth(n.props.label) + nodePadding * 2,
        height: nodeHeight,
      });

      const EdgeElement = React.cloneElement(edge, {
        parentNode: rootNode,
        childNode: NodeElement,
      });

      edgeElements.push(EdgeElement);

      return NodeElement;
    });

    mindMapNodes.push(nodeElements);

    nodeElements.forEach(node => {
      renderNodeChildren(node);
    });
  };

  /**
   * Render children of a node
   */
  const renderNodeChildren = node => {
    const nodeChildren = getNodeChildren(node);

    if (!nodeChildren.length) {
      return;
    }

    const nodeChildrenElements = nodeChildren.map((n, i) => {
      //shift = 3.14 / 4 / circleNum;
      const shift = 3.14 / 2 / nodeChildren.length;

      const parentNode = nodes.find(
        n1 =>
          n1.props.id ===
          edges.find(e => e.props.to === n.props.id)?.props.from,
      );

      const edge = edges.find(e => e.props.to === n.props.id);

      const parentPosition = nodePositions.find(
        p => p.id == parentNode.props.id,
      );

      const φ =
        i * shift +
        (parentPosition?.φ || 0) -
        (nodeChildren.length * shift) / 2;

      radius = calculateRadius(nodeChildren, n);

      const parentNodeWidth =
        getTextWidth(parentNode.props.label) + nodePadding * 2;

      const c = center;
      const y = center + parentPosition.y + radius * Math.sin(φ);
      const x =
        center + (parentPosition.x + parentNodeWidth) + radius * Math.cos(φ);
      nodePositions.push({ id: n.props.id, x, y, φ });

      const NodeElement = React.cloneElement(n, {
        x,
        y,
        width: getTextWidth(n.props.label) + nodePadding * 2,
        height: nodeHeight,
        padding: nodePadding,
      });

      const EdgeElement = React.cloneElement(edge, {
        parentNode: node,
        childNode: NodeElement,
      });

      edgeElements.push(EdgeElement);

      return NodeElement;
    });

    mindMapNodes.push(nodeChildrenElements);

    circleNum++;
    console.log('circleNum: ', circleNum);

    nodeChildrenElements.forEach(levelNode => {
      renderNodeChildren(levelNode);
    });
  };

  const rootNode = getRootNode(nodes, edges);

  const RootNodeElement = React.cloneElement(rootNode, {
    x: center,
    y: center,
    width: getTextWidth(rootNode.props.label) + nodePadding * 2,
    height: nodeHeight,
    padding: nodePadding,
  });

  mindMapNodes.push(RootNodeElement);

  nodePositions.push({ id: rootNode.props.id, x: center, y: center, φ: 0 });

  renderRootChildren(RootNodeElement);

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

  const svgSize = getCirlceRadius(circleNum + 1) * 2 + center;
  const focusNodePosition = nodePositions.find(p => p.id == focusNodeId);
  const initialFocusPosition = {
    x: svgSize / 2 + (focusNodePosition?.x || 0),
    y: svgSize / 2 + (focusNodePosition?.y || 0),
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
