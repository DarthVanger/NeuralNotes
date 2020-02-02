import { createAction, createActions } from 'redux-actions';
import { withPayload } from 'helpers/redux';
import { UPLOADS_REDUCER_KEY } from './UploadsConstants';

export const addUploadingFiles = createAction(
  'ADD_UPLOADING_FILES',
  (files, uploadFolderId) => ({
    files,
    uploadFolderId,
  }),
);

export const fileUploadInitialized = createAction(
  'FILE_UPLOAD_INITIALIZED',
  (file, uploadFolderId) => ({ file, uploadFolderId }),
);

export const fileUploadGetLocation = createAction(
  'FILE_UPLOAD_GET_LOCATION',
  (file, uploadFolderId) => ({ file, uploadFolderId }),
);

export const fileUploadingStarted = createAction(
  'FILE_UPLOADING_STARTED',
  (file, uploadFolderId) => ({
    file,
    uploadFolderId,
  }),
);

export const fileUploadingProgressUpdated = createAction(
  'FILE_UPLOADING_PROGRESSS_UPDATED',
  (file, uploadFolderId, progress) => ({ file, uploadFolderId, progress }),
);

export const fileUploadingSuccess = createAction(
  'FILE_UPLOADING_SUCCESS',
  (file, uploadFolderId, result) => ({ file, uploadFolderId, result }),
);

export const fileUploadingFailure = createAction(
  'FILE_UPLOADING_FAILURE',
  (file, uploadFolderId, error) => ({ file, uploadFolderId, error }),
);

export const retryFileUpload = createAction(
  'RETRY_FILE_UPLOAD',
  (file, uploadFolderId) => ({ file, uploadFolderId }),
);

export const clearAttachmentList = createAction('CLEAR_ATTACHMENT_LIST');

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
      RETRY_UPLOAD: withPayload('file', 'uploadFolderId'),
    },
  },
  {
    prefix: UPLOADS_REDUCER_KEY.toUpperCase(),
  },
);
