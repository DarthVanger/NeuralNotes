import { handleActions } from 'redux-actions';

import { updateState } from 'helpers/redux';

import { UploadsActions } from './UploadsActions';
import { UPLOADS_REDUCER_KEY } from './UploadsConstants';
import { defaultState } from './UploadsReducerDefaultState';

function updateList(updater) {
  return updateState('list', updater);
}

function addFiles(list, { files }) {
  return [...files.map(file => ({ file })), ...list];
}

function updateFileInList(list, { file, ...updates }) {
  return list.map(item => {
    if (item.file !== file) {
      return item;
    }

    return {
      ...item,
      ...updates,
    };
  });
}

function updateFile() {
  return updateList(updateFileInList);
}

export const uploadsReducer = handleActions(
  {
    [UploadsActions.list.addedFiles]: updateList(addFiles),
    [UploadsActions.list.clear]: updateList([]),

    [UploadsActions.file.sessionRetrieved]: updateFile(),
    [UploadsActions.file.progressUpdated]: updateFile(),
    [UploadsActions.file.uploadSuccess]: updateFile(),
    [UploadsActions.file.uploadFailure]: updateFile(),
    [UploadsActions.file.retryUpload]: updateFile(),
    [UploadsActions.file.setUploadedLength]: updateFile(),
  },
  defaultState,
);

uploadsReducer.KEY = UPLOADS_REDUCER_KEY;
