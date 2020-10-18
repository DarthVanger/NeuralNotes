/**
 * Use it for debug when styling
 */
const debug = false;

const debugDefaultState = {
  list: [
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
      progress: {
        percent: 47,
      },
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
  list: [],
};

export const defaultState = debug ? debugDefaultState : normalDefaultState;
