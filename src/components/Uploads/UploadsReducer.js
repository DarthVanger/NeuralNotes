import { handleActions } from 'redux-actions';
import { updateState } from 'helpers/redux';
import { defaultState } from './UploadsReducerDefaultState';
import { UPLOADS_REDUCER_KEY, UPLOADS_STATUS_ENUM } from './UploadsConstants';
import { UploadsActions } from './UploadsActions';

function addFiles(list, { files }) {
  return [
    ...files.map(file => ({
      file,
      status: UPLOADS_STATUS_ENUM.NOT_INITIALIZED,
    })),
    ...list,
  ];
}

function updateFile(list, { file, ...updates }) {
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

export const uploadsReducer = handleActions(
  {
    [UploadsActions.list.addedFiles]: updateState('list', addFiles),
    [UploadsActions.list.clear]: updateState('list', []),
    [UploadsActions.file.sessionRetrieved]: updateState('list', updateFile),
    [UploadsActions.file.progressUpdated]: updateState('list', updateFile),
    [UploadsActions.file.uploadSuccess]: updateState('list', updateFile),
    [UploadsActions.file.uploadFailure]: updateState('list', updateFile),
  },
  defaultState,
);

uploadsReducer.KEY = UPLOADS_REDUCER_KEY;
