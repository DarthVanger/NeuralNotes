function doesDeletedNodeHasSiblings(edges, parentId) {
  return edges.find(edge => edge.from === parentId);
}

function revokeParentStatus(nodes, parentId) {
  return nodes.map(node => {
    return node.id === parentId ? { ...node, group: 'children' } : node;
  });
}

const hasChildren = (edges, nodeId) =>
  Boolean(edges.find(edge => edge.from === nodeId));

export function removeNodeFromGraph(nodes, edges, nodeToDelete) {
  let newNodes = [...nodes];
  let newEdges = [...edges];
  let parentId = newEdges.find(edge => edge.to === nodeToDelete.id).from;

  removenode(nodeToDelete.id);

  newNodes = doesDeletedNodeHasSiblings(newEdges, parentId)
    ? newNodes
    : revokeParentStatus(newNodes, parentId);
  return { nodes: newNodes, edges: newEdges };

  function removenode(nodeId) {
    newNodes = newNodes.filter(node => node.id !== nodeId);
    if (hasChildren(newEdges, nodeId)) {
      newEdges.forEach(edge => {
        if (edge.from === nodeId) {
          removenode(edge.to);
          newEdges = newEdges.filter(e => e.from !== nodeId);
        }
      });
    }
    newEdges = newEdges.filter(e => e.to !== nodeId); // remove the edge from parent to the deleted node
    return;
  }
}

export function updateGroupOfOldParent(nodes, edges, newParentId, oldParentId) {
  return nodes.map(node => {
    if (node.id === newParentId) return { ...node, group: 'parent' };
    else if (
      node.id === oldParentId &&
      edges.find(edge => edge.from === node.id) === undefined
    ) {
      return { ...node, group: 'children' };
    }
    return node;
  });
}

export function addGroupTagToNodes(nodes, edges) {
  return nodes.map(node =>
    node.isNote && hasChildren(edges, node.id)
      ? { ...node, group: 'parent' }
      : node,
  );
}
