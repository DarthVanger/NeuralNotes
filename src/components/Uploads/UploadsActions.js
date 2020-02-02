import { createActions } from 'redux-actions';
import { withPayload } from 'helpers/redux';
import { UPLOADS_REDUCER_KEY } from './UploadsConstants';

export const UploadsActions = createActions(
  {
    LIST: {
      ADDED_FILES: withPayload('files'),
      CLEAR: null,
    },
    FILE: {
      SESSION_RETRIEVED: withPayload('file', 'session'),
      PROGRESS_UPDATED: withPayload('file', 'progress'),
      UPLOAD_SUCCESS: withPayload('file', 'result'),
      UPLOAD_FAILURE: withPayload('file', 'error'),
      CANCEL_UPLOAD: withPayload('file'),
      RETRY_UPLOAD: withPayload('file'),
    },
  },
  {
    prefix: UPLOADS_REDUCER_KEY.toUpperCase(),
  },
);
