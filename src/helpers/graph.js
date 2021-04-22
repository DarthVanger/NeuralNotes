function doesNodeHasChildren(edges, nodeId) {
  return edges.find(edge => edge.from === nodeId);
}

function revokeParentStatus({ nodes, nodeId }) {
  return nodes.map(node => {
    return node.id === nodeId ? { ...node, group: 'children' } : node;
  });
}

export function doesNodeHasParent(node, edges) {
  return edges.find(edge => edge.to === node.id);
}

export function removeNodeFromGraph(nodes, edges, nodeToDelete) {
  let newNodes = [...nodes];
  let newEdges = [...edges];
  let parentId = newEdges.find(edge => edge.to === nodeToDelete.id).from;

  removeChildren(nodeToDelete.id);

  newNodes = doesNodeHasChildren(newEdges, parentId)
    ? newNodes
    : revokeParentStatus({ nodes: newNodes, nodeId: parentId });
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

export function addGroupTagToNodes(nodes, edges) {
  return nodes.map(node =>
    !node.isUploadedFile && doesNodeHasChildren(edges, node.id)
      ? { ...node, group: 'parent' }
      : !node.isUploadedFile
      ? { ...node, group: 'children' }
      : node,
  );
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

export function nodeHasChildren({ nodes, edges }, node) {
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
