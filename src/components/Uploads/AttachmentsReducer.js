import { handleActions } from 'redux-actions';
import dotProp from 'dot-prop-immutable';
import * as Actions from './AttachmentsActions';

/**
 * Use it for debug when styling
 */
const debug = false;

const debugDefaultState = {
  uploads: [
    {
      file: {
        name: 'File uploaded',
      },
      status: 'done',
      result: {
        id: 'bla bla',
      },
    },
    {
      file: {
        name: 'File uploading',
      },
      status: 'uploading',
      progress: 0.47,
    },
    {
      file: {
        name: 'File error',
      },
      status: 'error',
      error: {
        message: 'Something went wrong',
      },
    },
    {
      file: {
        name: 'File initializing',
      },
    },
  ],
};

const normalDefaultState = {
  uploads: [],
};

const defaultState = debug ? debugDefaultState : normalDefaultState;

function updateFile(updates) {
  return (state, { payload: { file, uploadFolderId, ...restPayload } }) =>
    dotProp.set(state, 'uploads', uploads =>
      uploads.map(item => {
        if (!(item.file === file && item.uploadFolderId === uploadFolderId)) {
          return item;
        }

        if (typeof updates === 'function') {
          return {
            file,
            uploadFolderId,
            ...updates(restPayload),
          };
        }

        return {
          file,
          uploadFolderId,
          ...updates,
        };
      }),
    );
}

export const attachmentsReducer = handleActions(
  {
    [Actions.addUploadingFiles]: (
      state,
      { payload: { files, uploadFolderId } },
    ) =>
      dotProp.set(state, 'uploads', uploads => [
        ...Array.from(files).map(file => ({ file, uploadFolderId })),
        ...uploads,
      ]),
    [Actions.fileUploadInitialized]: updateFile({ status: 'initialized' }),
    [Actions.fileUploadGetLocation]: updateFile({ status: 'getLocation' }),
    [Actions.fileUploadingStarted]: updateFile({
      status: 'started',
      progress: 0,
    }),
    [Actions.fileUploadingProgressUpdated]: updateFile(({ progress }) => ({
      progress,
      status: 'uploading',
    })),
    [Actions.fileUploadingSuccess]: updateFile(({ result }) => ({
      result,
      status: 'done',
    })),
    [Actions.fileUploadingFailure]: updateFile(({ error }) => ({
      error,
      status: 'error',
    })),
    [Actions.clearAttachmentList]: () => defaultState,
  },
  defaultState,
);
