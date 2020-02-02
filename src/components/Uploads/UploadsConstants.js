export const UPLOADS_REDUCER_KEY = 'uploads';

export const UPLOADS_STATUS_ENUM = {
  NOT_INITIALIZED: Symbol('not initialized'),
  INITIALIZED: Symbol('initialized'),
  UPLOAD_SESSION_RETRIEVED: Symbol('upload session retrieved'),
  UPLOADING: Symbol('uploading'),
  SUCCESS: Symbol('success'),
  FAILURE: Symbol('failure'),
};
