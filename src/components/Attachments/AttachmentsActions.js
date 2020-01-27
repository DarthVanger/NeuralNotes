import { createAction } from 'redux-actions';

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

export const clearList = createAction('CLEAR_LIST');
