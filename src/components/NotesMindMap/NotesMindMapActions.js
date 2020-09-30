export const CHANGE_NOTE_TEXT_ACTION = 'CHANGE_NOTE_TEXT_ACTION';
export const CHANGE_SELECTED_NOTE_ACTION = 'CHANGE_SELECTED_NOTE_ACTION';
export const CHANGE_NOTE_VIS_NETWORK_NOTE_ACTION =
  'CHANGE_NOTE_VIS_NETWORK_NOTE_ACTION';
export const NOTE_CHANGE_PARENT_ACTION = 'NOTE_CHANGE_PARENT_ACTION';
export const CREATE_EMPTY_CHILD_ACTION = 'CREATE_EMPTY_CHILD_ACTION';
export const DELETE_NOTE_ACTION = 'DELETE_NOTE_ACTION';
export const DELETE_NOTE_REQUEST_SUCCESS_ACTION =
  'DELETE_NOTE_REQUEST_SUCCESS_ACTION';
export const EDIT_NOTE_NAME_ACTION = 'EDIT_NOTE_NAME_ACTION';
export const NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION =
  'NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION';
export const UPDATE_NOTE_NAME_ACTION = 'UPDATE_NOTE_NAME_ACTION';
export const SELECTED_NOTE_CHILDREN_FETCHED_ACTION =
  'SELECTED_NOTE_CHILDREN_FETCHED_ACTION';
export const CREATE_NOTE_SUCCESS_ACTION = 'CREATE_NOTE_SUCCESS_ACTION';
export const MIND_MAP_CLICKED_ACTION = 'MIND_MAP_CLICKED_ACTION';
export const CHANGE_PARENT_BUTTON_CLICKED_ACTION =
  'CHANGE_PARENT_BUTTON_CLICKED_ACTION';
export const CHANGE_PARENT_REQUEST_SUCCESS_ACTION =
  'CHANGE_PARENT_REQUEST_SUCCESS_ACTION';
export const CHANGE_PARENT_REQUEST_FAIL_ACTION =
  'CHANGE_PARENT_REQUEST_FAIL_ACTION';
export const SAVE_SEARCH_RESULTS = 'SAVE_SEARCH_RESULTS';

export const changeNoteTextAction = data => ({
  type: CHANGE_NOTE_TEXT_ACTION,
  data,
});
export const changeSelectedNoteAction = data => ({
  type: CHANGE_SELECTED_NOTE_ACTION,
  data,
});
export const selectedNoteChildrenFetchedAction = data => ({
  type: SELECTED_NOTE_CHILDREN_FETCHED_ACTION,
  data,
});
export const updateNoteNameAction = data => ({
  type: UPDATE_NOTE_NAME_ACTION,
  data,
});
export const noteNameUpdateRequestSuccessAction = data => ({
  type: NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION,
  data,
});
export const createNoteSuccessAction = data => ({
  type: CREATE_NOTE_SUCCESS_ACTION,
  data,
});
export const editNoteNameAction = data => ({
  type: EDIT_NOTE_NAME_ACTION,
  data,
});
export const mindMapClickedAction = data => ({
  type: MIND_MAP_CLICKED_ACTION,
  data,
});
export const deleteNoteRequestSuccessAction = data => ({
  type: DELETE_NOTE_REQUEST_SUCCESS_ACTION,
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
export const changeParentButtonClickedAction = data => ({
  type: CHANGE_PARENT_BUTTON_CLICKED_ACTION,
  data,
});
export const saveSearchResults = data => ({
  type: SAVE_SEARCH_RESULTS,
  data,
});
