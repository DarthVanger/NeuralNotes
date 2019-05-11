import { combineReducers } from 'redux';

import { appReducer } from 'reducers/appReducer';

export const rootReducer = combineReducers({
  appReducer,
});
