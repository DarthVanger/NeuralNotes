export const NOTES_GRAPH_LOADED_FROM_LOCAL_STORAGE_ACTION =
  'NOTES_GRAPH_LOADED_FROM_LOCAL_STORAGE_ACTION';

export const notesGraphLoadedFromLocalStorageAction = data => ({
  type: NOTES_GRAPH_LOADED_FROM_LOCAL_STORAGE_ACTION,
  data,
});
