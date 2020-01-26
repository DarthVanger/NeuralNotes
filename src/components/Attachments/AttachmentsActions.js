import { createAction } from 'redux-actions';

export const addUploadingFiles = createAction('ADD_UPLOADING_FILES', files => ({
  files,
}));
