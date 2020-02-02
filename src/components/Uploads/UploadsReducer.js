import { handleActions } from 'redux-actions';
import { updateState } from 'helpers/redux';
import { defaultState } from './UploadsReducerDefaultState';
import { UPLOADS_REDUCER_KEY } from './UploadsConstants';
import { UploadsActions } from './UploadsActions';

function addFiles(list, { files }) {
  return [...files, ...list];
}

export const uploadsReducer = handleActions(
  {
    [UploadsActions.list.addedFiles]: updateState('list', addFiles),
    [UploadsActions.list.clear]: updateState('list', []),
  },
  defaultState,
);

uploadsReducer.KEY = UPLOADS_REDUCER_KEY;
