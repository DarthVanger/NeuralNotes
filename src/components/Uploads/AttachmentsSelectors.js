import { createSelector } from 'reselect';
import { UPLOADS_REDUCER_KEY } from './UploadsConstants';

const getAttachmentsState = state => state[UPLOADS_REDUCER_KEY];

export const getUploads = createSelector(
  getAttachmentsState,
  attachments => attachments.list,
);

export const hasUploadingFiles = createSelector(
  getUploads,
  uploads => uploads.length > 0,
);

export const isUploadingProcessing = createSelector(
  getUploads,
  uploads =>
    uploads.filter(item => !['done', 'error'].includes(item.status)).length > 0,
);

export const canClearUploadList = createSelector(
  getUploads,
  uploads =>
    uploads.filter(item => !['done', 'error'].includes(item.status)).length ===
    0,
);
