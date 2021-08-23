export const EDITOR_NOTE_NAME_CHANGED_ACTION =
  'EDITOR_NOTE_NAME_CHANGED_ACTION';

export const EDITOR_NOTE_CONTENT_CHANGED_ACTION =
  'EDITOR_NOTE_CONTENT_CHANGED_ACTION';

export const NOTE_CONTENT_FETCH_SUCCESS_ACTION =
  'NOTE_CONTENT_FETCH_SUCCESS_ACTION';

export const NOTE_NAME_UPDATE_REQUEST = 'NOTE_NAME_UPDATE_REQUEST_ACTION';

export const NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION =
  'NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION';

export const NOTE_CONTENT_UPDATE_REQUEST = 'NOTE_CONTENT_UPDATE_REQUEST_ACTION';

export const NOTE_CONTENT_UPDATE_REQUEST_SUCCESS_ACTION =
  'NOTE_CONTENT_UPDATE_REQUEST_SUCCESS_ACTION';

export const CREATE_NOTE_REQUEST_ACTION = 'CREATE_NOTE_REQUEST_ACTION';

export const CREATE_NOTE_SUCCESS_ACTION = 'CREATE_NOTE_SUCCESS_ACTION';
export const CREATE_NOTE_REQUEST_FAIL_ACTION =
  'CREATE_NOTE_REQUEST_FAIL_ACTION';

export const QUEUE_NOTE_UPDATE_ACTION = 'QUEUE_NOTE_UPDATE_ACTION';

export const APPLY_QUEUED_NOTE_UPDATE_ACTION =
  'APPLY_QUEUED_NOTE_UPDATE_ACTION';

export const NEW_NOTE_DISCARDED_ACTION = 'NEW_NOTE_DISCARDED_ACTION';

export const NOTE_EDITOR_OPENED_ACTION = 'NOTE_EDITOR_OPENED_ACTION';

export const createNoteRequestFailAction = data => ({
  type: CREATE_NOTE_REQUEST_FAIL_ACTION,
  data,
});

export const noteEditorOpenedAction = data => ({
  type: NOTE_EDITOR_OPENED_ACTION,
  data,
});

export const newNoteDiscardedAction = data => ({
  type: NEW_NOTE_DISCARDED_ACTION,
  data,
});

export const createNoteSuccessAction = data => ({
  type: CREATE_NOTE_SUCCESS_ACTION,
  data,
});

export const createNoteRequestAction = data => ({
  type: CREATE_NOTE_REQUEST_ACTION,
  data,
});

export const noteNameUpdateRequestAction = note => ({
  type: NOTE_NAME_UPDATE_REQUEST,
  data: { note },
});

export const noteContentUpdateRequestAction = note => ({
  type: NOTE_CONTENT_UPDATE_REQUEST,
  data: { note },
});

export const noteNameUpdateRequestSuccessAction = data => ({
  type: NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION,
  data,
});

export const noteContentUpdateRequestSuccessAction = data => ({
  type: NOTE_CONTENT_UPDATE_REQUEST_SUCCESS_ACTION,
  data,
});

export const noteContentFetchSuccessAction = noteContent => ({
  type: NOTE_CONTENT_FETCH_SUCCESS_ACTION,
  data: noteContent,
});

export const queueNoteUpdateAction = data => ({
  type: QUEUE_NOTE_UPDATE_ACTION,
  data,
});

export const applyQueuedNoteUpdateAction = data => ({
  type: APPLY_QUEUED_NOTE_UPDATE_ACTION,
  data,
});
