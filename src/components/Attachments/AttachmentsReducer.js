import { handleActions } from 'redux-actions';

const defaultState = {
  uploads: [],
};

export const attachmentsReducer = handleActions({}, defaultState);
