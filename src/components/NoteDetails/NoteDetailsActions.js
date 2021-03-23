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

export const QUEUE_NOTE_UPDATE_ACTION = 'QUEUE_NOTE_UPDATE_ACTION';

export const APPLY_QUEUED_NOTE_UPDATE_ACTION =
  'APPLY_QUEUED_NOTE_UPDATE_ACTION';

export const createNoteSuccessAction = data => ({
  type: CREATE_NOTE_SUCCESS_ACTION,
  data,
});

export const createNoteRequestAction = note => ({
  type: CREATE_NOTE_REQUEST_ACTION,
  data: { note },
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
