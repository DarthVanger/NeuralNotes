import { createAction } from 'redux-actions';

export const addUploadingFiles = createAction('ADD_UPLOADING_FILES', files => ({
  files,
}));

export const fileUploadInitialized = createAction(
  'FILE_UPLOAD_INITIALIZED',
  file => ({ file }),
);

export const fileUploadGetLocation = createAction(
  'FILE_UPLOAD_GET_LOCATION',
  file => ({ file }),
);

export const fileUploadingStarted = createAction(
  'FILE_UPLOADING_STARTED',
  file => ({
    file,
  }),
);

export const fileUploadingProgressUpdated = createAction(
  'FILE_UPLOADING_PROGRESSS_UPDATED',
  (file, progress) => ({ file, progress }),
);

export const fileUploadingSuccess = createAction(
  'FILE_UPLOADING_SUCCESS',
  (file, result) => ({ file, result }),
);

export const fileUploadingFailure = createAction(
  'FILE_UPLOADING_FAILURE',
  (file, error) => ({ file, error }),
);
