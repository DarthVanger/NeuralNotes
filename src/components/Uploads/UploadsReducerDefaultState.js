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
  list: [],
};

export const defaultState = debug ? debugDefaultState : normalDefaultState;
