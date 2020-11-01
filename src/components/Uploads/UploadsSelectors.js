import { createSelector } from 'reselect';

import { UPLOADS_REDUCER_KEY } from './UploadsConstants';

const getUploadsState = state => state[UPLOADS_REDUCER_KEY];

export const getUploadsList = createSelector(
  getUploadsState,
  uploads => uploads.list,
);

export const getActiveUploadsList = createSelector(getUploadsList, list =>
  list.filter(item => !item.result && !item.error),
);

export const hasUploads = createSelector(
  getUploadsList,
  list => list.length > 0,
);

export const hasActiveUploads = createSelector(
  getActiveUploadsList,
  list => list.length > 0,
);
