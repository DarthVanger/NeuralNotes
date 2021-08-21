function doesNodeHasChildren(edges, nodeId) {
  return edges.find(edge => edge.from === nodeId);
}

export function doesNodeHasParent(node, edges) {
  return edges.find(edge => edge.to === node.id);
}

export function removeNodeFromGraph({ nodes, edges }, nodeToDelete) {
  let newNodes = [...nodes];
  let newEdges = [...edges];

  removeChildren(nodeToDelete.id);

  return { nodes: newNodes, edges: newEdges };

  function removeChildren(nodeId) {
    newNodes = newNodes.filter(node => node.id !== nodeId);
    if (doesNodeHasChildren(newEdges, nodeId)) {
      newEdges.forEach(edge => {
        if (edge.from === nodeId) {
          removeChildren(edge.to);
          newEdges = newEdges.filter(e => e.from !== nodeId);
        }
      });
    }
    newEdges = newEdges.filter(e => e.to !== nodeId); // remove the edge from parent to the deleted node
    return;
  }
}

export function getDepth(nodes, edges) {
  const depths = edges.map(edge => {
    return depthOfNode(edge.to);
  });

  return Math.max.apply(Math, depths);

  function depthOfNode(nodeId) {
    const edge = edges.find(e => e.from === nodeId);
    if (edge) {
      return 1 + depthOfNode(edge.to);
    } else {
      return 1;
    }
  }
}

export function nodeHasChildren({ edges }, node) {
  return Boolean(edges.find(edge => edge.from === node.id));
}

export function getNodeChildren({ nodes, edges }, node) {
  return edges
    .filter(e => e.from === node.id)
    .map(e => nodes.find(n => e.to === n.id));
}

export function getParentNode({ nodes, edges }, node) {
  const edgePointingToNode = edges.find(e => e.to === node.id);
  if (!edgePointingToNode) return undefined;
  return nodes.find(n => n.id === edgePointingToNode.from);
}

export function getNeighbours({ nodes, edges }, node) {
  const parentNode = getParentNode({ nodes, edges }, node);
  const parentChildren = getNodeChildren({ nodes, edges }, parentNode);
  const nodeIndexInParentChildren = parentChildren.indexOf(node);

  if (nodeIndexInParentChildren === -1) {
    throw new Error('Can not find the passed node in the graph');
  }

  const leftNeighbour = parentChildren[nodeIndexInParentChildren - 1];
  const rightNeighbour = parentChildren[nodeIndexInParentChildren + 1];
  return { leftNeighbour, rightNeighbour };
}

export function getLeftNeighbour({ nodes, edges }, node) {
  return getNeighbours({ nodes, edges }, node).leftNeighbour;
}

export function doesNeighbourHaveChildren({ nodes, edges }, node) {
  const { leftNeighbour, rightNeighbour } = getNeighbours(
    { nodes, edges },
    node,
  );

  if (leftNeighbour && nodeHasChildren({ nodes, edges }, leftNeighbour)) {
    return true;
  }

  if (rightNeighbour && nodeHasChildren({ nodes, edges }, rightNeighbour)) {
    return true;
  }

  return false;
}

export function getRootNode({ nodes, edges }) {
  return getParentRecursive(nodes[0].id);

  function getParentRecursive(nodeId) {
    const parentId = edges.find(e => e.to === nodeId)?.from;

    if (!parentId) {
      return nodes.find(n => n.id === nodeId);
    }

    return getParentRecursive(parentId);
  }
}

/**
 * Get node siblings which are on the left of the passed node.
 * I.e. siblings from the first one to the passed node, without
 * the siblings which come after the passed node.
 */
export const getLeftSideSiblings = ({ nodes, edges }, node) => {
  const parentNode = getParentNode({ nodes, edges }, node);
  const parentChildren = getNodeChildren({ nodes, edges }, parentNode);
  const nodeIndexInParentChildren = parentChildren.indexOf(node);

  if (nodeIndexInParentChildren === -1) {
    throw new Error('Can not find the passed node in the graph');
  }

  const leftSiblings = [];
  for (let i = 0; i < nodeIndexInParentChildren; i++) {
    leftSiblings.push(parentChildren[i]);
  }
  return leftSiblings;
};

export const getDeepestFirstChild = ({ nodes, edges }, node) => {
  const getFirstChildRecursive = firstChild => {
    const children = getNodeChildren({ nodes, edges }, firstChild);
    if (children.length === 0) {
      return firstChild;
    }

    return getFirstChildRecursive(children[0]);
  };

  return getFirstChildRecursive(node);
};

export const getDeepestLastChild = ({ nodes, edges }, node) => {
  const getLastChildRecursive = lastChild => {
    const children = getNodeChildren({ nodes, edges }, lastChild);
    if (children.length === 0) {
      return lastChild;
    }

    return getLastChildRecursive(children[children.length - 1]);
  };

  return getLastChildRecursive(node);
};

export const isRootNode = (graph, node) => getRootNode(graph).id === node.id;

export const isNodeDecendantOf = (graph, node, possibleDeepParent) => {
  const isParentNodeRecursive = currentNode => {
    const nodeParent = getParentNode(graph, currentNode);

    if (!nodeParent) return false;

    if (nodeParent.id === possibleDeepParent.id) return true;

    return isParentNodeRecursive(nodeParent);
  };

  return isParentNodeRecursive(node);
};

export const removeEdge = (graph, { from, to }) => {
  const { edges } = graph;
  const edge = edges.find(edge => edge.from === from.id && edge.to === to.id);
  const updatedEdges = [...edges];
  updatedEdges.splice(edges.indexOf(edge), 1);
  return updatedEdges;
};

export const addEdge = (graph, { from, to }) => {
  const { edges } = graph;
  const updatedEdges = [...edges];
  updatedEdges.push({ from: from.id, to: to.id });
  return updatedEdges;
};

export const replaceNode = (graph, nodeToReplace, newNode) => {
  const { nodes } = graph;
  const updatedNodes = [...nodes];
  const nodeToReplaceIndex = nodes.indexOf(
    nodes.find(n => n.id === nodeToReplace.id),
  );
  updatedNodes[nodeToReplaceIndex] = newNode;
  return updatedNodes;
};
