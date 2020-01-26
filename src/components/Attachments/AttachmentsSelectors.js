// import { createSelector } from 'reselect';
import { NotesMindMapSelectors } from './AttachmentsImportedSelectors';

export const isUploadButtonVisible =
  NotesMindMapSelectors.isSelectedNoteRealNote;
