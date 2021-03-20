import { createSelector } from 'reselect';

const getMindMapState = state => state.notesMindMap;

export const getSelectedNote = createSelector(
  getMindMapState,
  mindMapState => mindMapState.selectedNote,
);

export const getSelectedNoteId = createSelector(getSelectedNote, selectedNote =>
  selectedNote ? selectedNote.id : null,
);
