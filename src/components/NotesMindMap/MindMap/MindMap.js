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

  const renderRootChildren = rootNode => {
    const children = edges
      .filter(e => e.props.from === rootNode.props.id)
      .map(e => nodes.find(n => n.props.id === e.props.to));

    console.debug('Rendering root children: ', children);

    const shift = (2 * 3.14) / children.length;

    const nodeElements = children.map((n, i) => {
      const φ = i * shift;
      const x = radius * Math.cos(φ);
      const y = radius * Math.sin(φ);

      nodePositions.push({
        id: n.props.id,
        x: x + center,
        y: y + center,
        φ,
      });

      const path = (
        <path
          d={`
          M ${center} ${center}
          l ${x} ${y}
        `}
          stroke={`rgb(${(circleNum * 50) % 255}, ${(circleNum * 100 * 3.14) %
            255}, ${(circleNum * 150) % 255})`}
          strokeWidth="2"
          fill="none"
          key={`${rootNode.props.id}->${n.props.id}`}
        />
      );

      edgeElements.push(path);

      return React.cloneElement(n, {
        x,
        y,
        textWidth: getTextWidth(n.props.label),
        padding: nodePadding,
      });
    });

    mindMapNodes.push(nodeElements);

    nodeElements.forEach(node => {
      renderLevel(node);
    });
  };

  /**
   * Render children of a node
   */
  const renderLevel = node => {
    const levelNodes = edges
      .filter(e => e.props.from === node.props.id)
      .map(e => nodes.find(n => e.props.to === n.props.id));

    let firstNodePosition;
    if (!levelNodes.length) {
      console.debug(`Node "${node.props.label}" has no children`);
      return;
    }

    console.debug(
      `Rendering level for "${
        node.props.label
      }". Level nodes: [${levelNodes.map(l => l.props.label).join(',')}]`,
    );

    const levelNodeElements = levelNodes.map((n, i) => {
      //shift = 3.14 / 4 / circleNum;
      const shift = 3.14 / 2 / levelNodes.length;

      const parent = nodes.find(
        n1 =>
          n1.props.id ===
          edges.find(e => e.props.to === n.props.id)?.props.from,
      );

      const parentPosition = nodePositions.find(p => p.id == parent.props.id);

      //let φ = i * shift * Math.pow(-1, i) + (parentPosition?.φ || 0);
      let φ = i * shift * Math.pow(-1, i) + (parentPosition?.φ || 0);

      console.debug(`Rendering node: "${n.props.label}"`);
      console.debug(`- parent: "${parent.props.label}"`);
      console.debug(
        `- parentPosition: "{${parentPosition?.x}, ${parentPosition?.y}}"`,
      );

      const parentNodeWidth =
        getTextWidth(parent.props.label) + nodePadding * 2;

      const c = center;
      const y = center + parentPosition.y + radius * Math.sin(φ);
      const x =
        center + (parentPosition.x + parentNodeWidth) + radius * Math.cos(φ);
      nodePositions.push({ id: n.props.id, x, y, φ });
      mindMapNodes.push(
        <circle
          r={radius}
          cx={center}
          cy={center}
          key={n.props.id}
          fill="none"
          stroke="#ddd"
          strokeWidth="1"
          strokeDasharray="4"
        />,
      );
      const path = (
        <path
          d={`
            M ${(parentPosition?.x || c) +
              parentNodeWidth} ${(parentPosition?.y || c) - nodeHeight / 2}
            L ${x} ${y - nodeHeight / 2}
          `}
          stroke={`rgb(${(circleNum * 50) % 255}, ${(circleNum * 100 * 3.14) %
            255}, ${(circleNum * 150) % 255})`}
          strokeWidth="2"
          fill="none"
          key={`${parent.props.id}->${n.props.id}`}
        />
      );

      console.debug(
        `- nodePositiong: "{${parentPosition?.x}, ${parentPosition?.y}}"`,
      );

      edgeElements.push(path);
      if (i == 0) {
        firstNodePosition = { x, y };
      }
      return React.cloneElement(n, {
        x,
        y,
        textWidth: getTextWidth(n.props.label),
        padding: nodePadding,
      });
    });

    mindMapNodes.push(levelNodeElements);

    circleNum++;
    console.log('circleNum: ', circleNum);

    levelNodes.forEach(levelNode => {
      renderLevel(levelNode);
    });
  };

  const rootNode = getRootNode(nodes, edges);
  mindMapNodes.push(
    React.cloneElement(rootNode, {
      x: center,
      y: center,
      textWidth: getTextWidth(rootNode.props.label),
      padding: nodePadding,
    }),
  );
  nodePositions.push({ id: rootNode.props.id, x: center, y: center, φ: 0 });
  renderRootChildren(rootNode);

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
