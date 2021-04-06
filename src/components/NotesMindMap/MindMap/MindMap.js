import React from 'react';
import { Node } from './Node';
import { Edge } from './Edge';

export { Node, Edge };

const center = 0;

const getCirlceRadius = circleNum => {
  if (circleNum < 0) return 0;
  return circleNum * 250;
};

const MindMap = ({ nodes, edges, ...attrs }) => {
  let circleNum = 1;
  let mindMapNodes = [];
  const edgeElements = [];
  const nodePositions = [];
  const slots = [];
  let shift = 3.14 / 4 / circleNum;

  slots[circleNum] = new Array(Math.floor((2 * 3.14) / shift)).fill(false);
  let slotNum = 0;
  let r = getCirlceRadius(circleNum);

  /**
   * Render children of a node
   */
  const renderLevel = (node, nodesRenderedOnThisCircle = 0) => {
    nodesRenderedOnThisCircle = 0;

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
      console.log('slots:', `[${slots.map(s => s.join(',')).join('\n  ')}\n]`);
      const freeSlots = slots[circleNum].filter(s => !s);
      if (freeSlots.length === 0) {
        console.log(
          'increasing circleNum, because there are no free slots left',
        );
        circleNum++;
        slots[circleNum] = new Array(Math.floor((2 * 3.14) / shift)).fill(
          false,
        );
        slotNum = 0;
        r = getCirlceRadius(circleNum);
        shift = 3.14 / 4 / circleNum;
        console.log('1- slots: ', slots);
      } else {
        slots[circleNum][slotNum] = true;
        slotNum++;
      }

      console.log('circleNum: ', circleNum);

      const parent = nodes.find(
        n1 =>
          n1.props.id ===
          edges.find(e => e.props.to === n.props.id)?.props.from,
      );

      const parentPosition = nodePositions.find(p => p.id == parent.props.id);

      let φ =
        (i + nodesRenderedOnThisCircle) * shift + (parentPosition?.φ || 0);
      if (parentPosition?.φ) {
        //φ += 3.14 / Math.pow(circleNum + 1, 2);
      }

      console.debug(`Rendering node: "${n.props.label}"`);
      console.debug(`- parent: "${parent.props.label}"`);
      console.debug(
        `- parentPosition: "{${parentPosition?.x}, ${parentPosition?.y}}"`,
      );

      const c = center;
      const y = center + r * Math.sin(φ);
      const x = center + r * Math.cos(φ);
      nodePositions.push({ id: n.props.id, x, y, φ });
      mindMapNodes.push(
        <circle
          r={r}
          cx={center}
          cy={center}
          key={n.id}
          fill="none"
          stroke="#ddd"
          strokeWidth="1"
          strokeDasharray="4"
        />,
      );
      const path = (
        <path
          d={`
            M ${parentPosition?.x || c} ${parentPosition?.y || c}
            L ${x} ${y}
          `}
          stroke={`rgb(${(circleNum * 50) % 255}, ${(circleNum * 100 * 3.14) %
            255}, ${(circleNum * 150) % 255})`}
          strokeWidth="2"
          fill="none"
          key={`${n.props.id}->${parent.props.id}`}
        />
      );

      console.debug(
        `- nodePositiong: "{${parentPosition?.x}, ${parentPosition?.y}}"`,
      );

      edgeElements.push(path);
      if (i == 0) {
        firstNodePosition = { x, y };
      }
      return React.cloneElement(n, { x, y });
    });

    mindMapNodes.push(levelNodeElements);

    levelNodes.forEach(levelNode => {
      renderLevel(levelNode, nodesRenderedOnThisCircle + levelNodes.length);
    });
  };

  const rootNode = getRootNode(nodes, edges);
  mindMapNodes.push(React.cloneElement(rootNode, { x: center, y: center }));
  nodePositions.push({ id: rootNode.props.id, x: center, y: center, φ: 0 });
  renderLevel(rootNode);

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
  return (
    <svg
      viewBox={`${-svgSize / 2} ${-svgSize / 2} ${svgSize} ${svgSize}`}
      width={svgSize}
      height={svgSize}
      {...attrs}>
      {edgeElements}
      {mindMapNodes}
    </svg>
  );
};

export default MindMap;
