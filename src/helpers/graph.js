export function addGroupTagToNotes(notes, edges) {
    if (notes && edges) {
        notes = notes.map(note => { // add group tag to all the egdes
            note.group = edges.filter(edge => edge.from === note.id).length > 0 ? 'parent' : 'children' 
            return note
        })
    }
    return notes
}

export function removeNoteFromGraph(notes, edges, noteToDelete) {
    notes = notes.filter(note => note.id !== noteToDelete.id) // remove the note from the array
    edges = edges.filter(edge => {  // remove all the children of the deleted parent
      if (edge.from === noteToDelete.id) {
        notes = notes.filter(note => note.id !== edge.to)
      } else { return edge }

      if (edge.to !== noteToDelete.id) return edge
    })

    return { notes, edges }
}