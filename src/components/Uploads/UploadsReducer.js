import { handleActions } from 'redux-actions';
import { updateState } from 'helpers/redux';
import { defaultState } from './UploadsReducerDefaultState';
import { UPLOADS_REDUCER_KEY, UPLOADS_STATUS_ENUM } from './UploadsConstants';
import { UploadsActions } from './UploadsActions';

function updateList(updater) {
  return updateState('list', updater);
}

function addFiles(list, { files }) {
  return [
    ...files.map(file => ({
      file,
      status: UPLOADS_STATUS_ENUM.NOT_INITIALIZED,
    })),
    ...list,
  ];
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
  },
  defaultState,
);

uploadsReducer.KEY = UPLOADS_REDUCER_KEY;