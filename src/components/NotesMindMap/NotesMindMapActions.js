export const CHANGE_SELECTED_NOTE_ACTION = 'CHANGE_SELECTED_NOTE_ACTION';
export const CHANGE_NOTE_VIS_NETWORK_NOTE_ACTION =
  'CHANGE_NOTE_VIS_NETWORK_NOTE_ACTION';
export const NOTE_CHANGE_PARENT_ACTION = 'NOTE_CHANGE_PARENT_ACTION';
export const UPDATE_NOTE_NAME_ACTION = 'UPDATE_NOTE_NAME_ACTION';
export const SELECTED_NOTE_CHILDREN_FETCHED_ACTION =
  'SELECTED_NOTE_CHILDREN_FETCHED_ACTION';
export const SELECTED_NOTE_PARENT_FETCHED_ACTION =
  'SELECTED_NOTE_PARENT_FETCHED_ACTION';

export const MIND_MAP_CLICKED_ACTION = 'MIND_MAP_CLICKED_ACTION';
export const CHANGE_PARENT_REQUEST_SUCCESS_ACTION =
  'CHANGE_PARENT_REQUEST_SUCCESS_ACTION';
export const CHANGE_PARENT_REQUEST_FAIL_ACTION =
  'CHANGE_PARENT_REQUEST_FAIL_ACTION';
export const SEARCH_RESULT_CLICKED = 'SEARCH_RESULT_CLICKED';

export const RESET_MIND_MAP_TO_ROOT_NODE = 'RESET_MIND_MAP_TO_ROOT_NODE';

export const changeSelectedNoteAction = data => ({
  type: CHANGE_SELECTED_NOTE_ACTION,
  data,
});
export const selectedNoteChildrenFetchedAction = data => ({
  type: SELECTED_NOTE_CHILDREN_FETCHED_ACTION,
  data,
});
export const selectedNoteParentFetchedAction = data => ({
  type: SELECTED_NOTE_PARENT_FETCHED_ACTION,
  data,
});
export const updateNoteNameAction = data => ({
  type: UPDATE_NOTE_NAME_ACTION,
  data,
});
export const mindMapClickedAction = data => ({
  type: MIND_MAP_CLICKED_ACTION,
  data,
});
export const changeParentRequestSuccessAction = data => ({
  type: CHANGE_PARENT_REQUEST_SUCCESS_ACTION,
  data,
});
export const changeParentRequestFailAction = data => ({
  type: CHANGE_PARENT_REQUEST_FAIL_ACTION,
  data,
});
export const searchResultClickedAction = data => ({
  type: SEARCH_RESULT_CLICKED,
  data,
});

export const INITIAL_NOTE_FETCHED_ACTION = 'INITIAL_NOTE_FETCHED_ACTION';

export const initialNoteFetchedAction = data => ({
  type: INITIAL_NOTE_FETCHED_ACTION,
  data,
});

export const resetMindMapToRootNode = () => ({
  type: RESET_MIND_MAP_TO_ROOT_NODE,
});
