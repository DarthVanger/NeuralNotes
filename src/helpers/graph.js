export function removeNoteFromGraph(nodes, edges, noteToDelete) {
  let newNodes = [ ...nodes ]
  let newEdges = [ ...edges ]
  let parentEdge = newEdges.find(edge => edge.to === noteToDelete.id)

  removeChild(noteToDelete.id)
  newNodes = newEdges.find(edge => edge.from === parentEdge.from) ? //check if there are siblings of deleted node if not revoke parant status
             newNodes : newNodes.map(node => { return node.id === parentEdge.from ? { ...node, group: 'children' } : node })
  return { notes: newNodes, edges: newEdges }

  function removeChild(childNoteId) {
    newNodes = newNodes.filter(note => note.id !== childNoteId)
    if(newEdges.find(edge => edge.from === childNoteId)) { // check if the node has children
      newEdges.forEach(edge => {
        if (edge.from === childNoteId) {
          removeChild(edge.to)
          newEdges = newEdges.filter(e => (e.from !== childNoteId))
        }
      })
      newEdges = newEdges.filter(e => e.to !== childNoteId) // remove the edge from parent to the deleted node
    } else {
      newEdges = newEdges.filter(e => e.to !== childNoteId)
      return;
    }
  }
}

export function updateGroupOfOldParent(nodes, edges, newParentId, oldParentId) {
  nodes = nodes.map(node => {
    if (node.id === newParentId) return { ...node, group: 'parent' }
    else if (node.id === oldParentId && edges.find(edge => edge.from === node.id) === undefined){
      return { ...node, group: 'children' }
    } 
    return node
  })
  return nodes
}

export function addGroupTagToNote(nodes, selectedNoteId) {
  nodes = nodes.map(note => (note.isNote && note.id === selectedNoteId) ? { ...note, group: 'parent' } : note)
  return nodes
}