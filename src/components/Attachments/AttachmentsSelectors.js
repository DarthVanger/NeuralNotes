import { createSelector } from 'reselect';
import { NotesMindMapSelectors } from './AttachmentsImportedSelectors';

export const isUploadButtonVisible =
  NotesMindMapSelectors.isSelectedNoteRealNote;

export const getUploadFolderId = NotesMindMapSelectors.getSelectedNoteId;

const getAttachmentsState = state => state.attachments;

export const getUploads = createSelector(
  getAttachmentsState,
  attachments => attachments.uploads,
);

export const getUploadFiles = createSelector(getUploads, uploads =>
  uploads.map(item => item.file),
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
