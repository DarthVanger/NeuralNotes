export function addGroupTagToNotes(notes, edges) {
    if (notes && edges) {
        notes = notes.map(note => {
            note.group = edges.filter(edge => edge.from === note.id).length > 0 ? 'parent' : 'children'
            return note
        })
    }
    return notes
}

export function removeNoteFromGraph(notes, edges, noteToDelete) {
    notes = notes.filter(note => note.id !== noteToDelete.id)
    edges = edges.filter(edge => {
      if (edge.from === noteToDelete.id) {
        notes = notes.filter(note => note.id !== edge.to)
      } else { return edge }

      if (edge.to !== noteToDelete.id) return edge
    })

    return { notes, edges }
}