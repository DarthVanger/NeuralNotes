import { handleActions } from 'redux-actions';
import dotProp from 'dot-prop-immutable';
import * as Actions from './AttachmentsActions';

const defaultState = {
  uploads: [],
};

function updateFile(updates) {
  return (state, { payload: { file, ...payload } }) =>
    dotProp.set(state, 'uploads', uploads =>
      uploads.map(item => {
        if (item.file !== file) {
          return item;
        }

        if (typeof updates === 'function') {
          return updates(file, payload);
        }

        return {
          file,
          ...updates,
        };
      }),
    );
}

export const attachmentsReducer = handleActions(
  {
    // [Actions.addUploadingFiles]: (state, { payload: files }) => ({
    //   ...state,
    //   uploads: [files.map(file => ({ file })), ...state.uploads],
    // }),
    [Actions.addUploadingFiles]: (state, { payload: { files } }) =>
      dotProp.set(state, 'uploads', uploads => [
        ...Array.from(files).map(file => ({ file })),
        ...uploads,
      ]),
    [Actions.fileUploadInitialized]: updateFile({ status: 'initialized' }),
    [Actions.fileUploadGetLocation]: updateFile({ status: 'getLocation ' }),
    [Actions.fileUploadingStarted]: updateFile({
      status: 'started',
      progress: 0,
    }),
    [Actions.fileUploadingProgressUpdated]: updateFile(
      (file, { progress }) => ({
        file,
        progress,
        status: 'uploading',
      }),
    ),
    [Actions.fileUploadingSuccess]: updateFile((file, { result }) => ({
      file,
      result,
      status: 'done',
    })),
    [Actions.fileUploadingFailure]: updateFile((file, { error }) => ({
      file,
      error,
      status: 'error',
    })),
  },
  defaultState,
);
