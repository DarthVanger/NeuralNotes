import { UNEXPECTED_ERROR_ACTION } from './AppActions';

const defaultState = {
  unexpectedError: null,
};

export const appReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case UNEXPECTED_ERROR_ACTION:
      return {
        ...state,
        unexpectedError: data,
      };
    default:
      return state;
  }
};
