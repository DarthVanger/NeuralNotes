import { createSelector } from 'reselect';

const getMindMapState = state => state.notesMindMap;

export const getSelectedNote = createSelector(
  getMindMapState,
  mindMapState => mindMapState.selectedNote,
);

export const isSelectedNoteRealNote = createSelector(
  getSelectedNote,
  selectedNote => selectedNote && selectedNote.isNote,
);
