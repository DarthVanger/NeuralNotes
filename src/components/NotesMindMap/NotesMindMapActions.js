export const CHANGE_NOTE_VIS_NETWORK_NOTE_ACTION =
  'CHANGE_NOTE_VIS_NETWORK_NOTE_ACTION';
export const NOTE_CHANGE_PARENT_ACTION = 'NOTE_CHANGE_PARENT_ACTION';
export const UPDATE_NOTE_NAME_ACTION = 'UPDATE_NOTE_NAME_ACTION';

export const CHANGE_PARENT_REQUEST_SUCCESS_ACTION =
  'CHANGE_PARENT_REQUEST_SUCCESS_ACTION';
export const CHANGE_PARENT_REQUEST_FAIL_ACTION =
  'CHANGE_PARENT_REQUEST_FAIL_ACTION';
export const SEARCH_RESULT_CLICKED = 'SEARCH_RESULT_CLICKED';

export const RESET_MIND_MAP_TO_ROOT_NODE = 'RESET_MIND_MAP_TO_ROOT_NODE';

export const MIND_MAP_NODE_CLICKED_ACTION = 'MIND_MAP_NODE_CLICKED_ACTION';

export const FETCH_NOTE_ACTION = 'FETCH_NOTE_ACTION';
export const NOTE_FETCH_SUCCESS_ACTION = 'NOTE_FETCH_SUCCESS_ACTION';
export const NOTE_FETCH_FAIL_ACTION = 'NOTE_FETCH_FAIL_ACTION';

export const NOTE_WITH_CHILDREN_AND_PARENT_FETCH_SUCCESS_ACTION =
  'NOTE_WITH_CHILDREN_AND_PARENT_FETCH_SUCCESS_ACTION';

export const FETCHED_NOTE_IS_TRASHED = 'FETCHED_NOTE_IS_TRASHED';

export const SELECT_NOTE_ACTION = 'SELECT_NOTE_ACTION';
export const FETCHED_NOTE_NOT_FOUND_ACTION = 'FETCHED_NOTE_NOT_FOUND_ACTION';

export const FETCH_NOTE_CHILDREN_AND_PARENT_REQUEST_FAIL_ACTION =
  'FETCH_NOTE_CHILDREN_AND_PARENT_REQUEST_FAIL_ACTION';

export const NEW_NOTE_PARENT_SELECTED_ACTION =
  'NEW_NOTE_PARENT_SELECTED_ACTION';

export const newNoteParentSelectedAction = data => ({
  type: NEW_NOTE_PARENT_SELECTED_ACTION,
  data,
});

export const noteFetchFailAction = data => ({
  type: NOTE_FETCH_FAIL_ACTION,
  data,
});

export const fetchNoteChildrenAndParentReqestFailAction = data => ({
  type: FETCH_NOTE_CHILDREN_AND_PARENT_REQUEST_FAIL_ACTION,
  data,
});

export const fetchedNoteNotFoundAction = data => ({
  type: FETCHED_NOTE_NOT_FOUND_ACTION,
  data,
});

export const selectNoteAction = data => ({
  type: SELECT_NOTE_ACTION,
  data,
});

export const fetchedNoteIsTrashed = data => ({
  type: FETCHED_NOTE_IS_TRASHED,
  data,
});

export const noteWithChildrenAndParentFetchSuccessAction = data => ({
  type: NOTE_WITH_CHILDREN_AND_PARENT_FETCH_SUCCESS_ACTION,
  data,
});
export const noteFetchSuccessAction = data => ({
  type: NOTE_FETCH_SUCCESS_ACTION,
  data,
});

export const fetchNoteAction = data => ({
  type: FETCH_NOTE_ACTION,
  data,
});

export const changeParentNoteAction = data => ({
  type: NOTE_CHANGE_PARENT_ACTION,
  data,
});

export const mindMapNodeClickedAction = data => ({
  type: MIND_MAP_NODE_CLICKED_ACTION,
  data,
});

export const updateNoteNameAction = data => ({
  type: UPDATE_NOTE_NAME_ACTION,
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
