import { createActions } from 'redux-actions';

import { UPLOADS_REDUCER_KEY } from './UploadsConstants';

export const UploadsActions = createActions(
  {
    LIST: {
      ADDED_FILES: files => ({ files }),
      CLEAR: null,
    },
    FILE: {
      SESSION_RETRIEVED: (file, session) => ({ file, session }),
      PROGRESS_UPDATED: (file, progress) => ({ file, progress }),
      UPLOAD_SUCCESS: (file, result) => ({ file, result }),
      UPLOAD_FAILURE: (file, error) => ({ file, error }),
      CANCEL_UPLOAD: file => ({ file }),
      RETRY_UPLOAD: file => ({ file, error: null }),
    },
  },
  {
    prefix: UPLOADS_REDUCER_KEY.toUpperCase(),
  },
);
