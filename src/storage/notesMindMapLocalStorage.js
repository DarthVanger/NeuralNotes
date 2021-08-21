import {
  graphSelector,
  getSelectedNote,
} from 'components/NotesMindMap/NotesMindMapSelectors';

const notesGraphLocalStorageKey = 'notesGraph';
const selectedNoteLocalStorageKey = 'selectedNote';

const saveGraph = graph => {
  localStorage.setItem(notesGraphLocalStorageKey, JSON.stringify(graph));
};

const saveSelectedNote = note => {
  localStorage.setItem(selectedNoteLocalStorageKey, JSON.stringify(note));
};

let previousGraphState;
let previousSelectedNoteState;
export const saveNotesMindMapToLocalStorageOnReduxStoreChange = store => {
  const state = store.getState();
  const graph = graphSelector(state);
  const selectedNote = getSelectedNote(state);

  if (graph !== previousGraphState && graph.nodes.length > 0) {
    saveGraph(graph);
    previousGraphState = graph;
  }

  if (selectedNote !== previousSelectedNoteState && selectedNote.id) {
    saveSelectedNote(selectedNote);
    previousSelectedNoteState = selectedNote;
  }
};

export const getMindMapFromLocalStorage = () => {
  const graph = getCachedNotesGraph();
  const selectedNote = getCachedSelectedNote();

  if (!graph || !selectedNote) return null;

  return {
    graph,
    selectedNote,
  };
};

export const getCachedNotesGraph = () => {
  const cachedGraphString = localStorage.getItem(notesGraphLocalStorageKey);

  if (!cachedGraphString) return null;

  return JSON.parse(cachedGraphString);
};

export const getCachedSelectedNote = () => {
  const cachedSelectedNoteString = localStorage.getItem(
    selectedNoteLocalStorageKey,
  );

  if (!cachedSelectedNoteString) return null;

  return JSON.parse(cachedSelectedNoteString);
};

export const clearNotesMindMapLocalStorage = () => {
  localStorage.removeItem(notesGraphLocalStorageKey);
  localStorage.removeItem(selectedNoteLocalStorageKey);
};
