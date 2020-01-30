function doesNodeHasChildren({ edges, nodeId }) {
  return edges.find(edge => edge.from === nodeId);
}

function revokeParentStatus({ nodes, nodeId }) {
  return nodes.map(node => {
    return node.id === nodeId ? { ...node, group: 'children' } : node;
  });
}

const hasChildren = (edges, nodeId) =>
  Boolean(edges.find(edge => edge.from === nodeId));

export function removeNodeFromGraph(nodes, edges, nodeToDelete) {
  let newNodes = [...nodes];
  let newEdges = [...edges];
  let parentId = newEdges.find(edge => edge.to === nodeToDelete.id).from;

  removeChildren(nodeToDelete.id);

  newNodes = doesNodeHasChildren({ edges: newEdges, nodeId: parentId })
    ? newNodes
    : revokeParentStatus({ nodes: newNodes, nodeId: parentId });
  return { nodes: newNodes, edges: newEdges };

  function removeChildren(nodeId) {
    newNodes = newNodes.filter(node => node.id !== nodeId);
    if (hasChildren(newEdges, nodeId)) {
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
    node.isNote && hasChildren(edges, node.id)
      ? { ...node, group: 'parent' }
      : node,
  );
}
