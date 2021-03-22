export const EDIT_NOTE_BUTTON_CLICKED_ACTION =
  'EDIT_NOTE_BUTTON_CLICKED_ACTION';
export const CREATE_EMPTY_CHILD_ACTION = 'CREATE_EMPTY_CHILD_ACTION';
export const CREATE_NOTE_SUCCESS_ACTION = 'CREATE_NOTE_SUCCESS_ACTION';
export const CHANGE_PARENT_BUTTON_CLICKED_ACTION =
  'CHANGE_PARENT_BUTTON_CLICKED_ACTION';
export const DELETE_NOTE_ACTION = 'DELETE_NOTE_ACTION';
export const DELETE_NOTE_REQUEST_SUCCESS_ACTION =
  'DELETE_NOTE_REQUEST_SUCCESS_ACTION';

export const editNoteButtonClickedAction = note => ({
  type: EDIT_NOTE_BUTTON_CLICKED_ACTION,
  data: { note },
});
export const createEmptyChildAction = note => ({
  type: CREATE_EMPTY_CHILD_ACTION,
  data: { parent: note },
});
export const createNoteSuccessAction = data => ({
  type: CREATE_NOTE_SUCCESS_ACTION,
  data,
});
export const changeParentButtonClickedAction = note => ({
  type: CHANGE_PARENT_BUTTON_CLICKED_ACTION,
  data: { note },
});
export const deleteNoteAction = note => ({
  type: DELETE_NOTE_ACTION,
  data: { note },
});
export const deleteNoteRequestSuccessAction = data => ({
  type: DELETE_NOTE_REQUEST_SUCCESS_ACTION,
  data,
});
