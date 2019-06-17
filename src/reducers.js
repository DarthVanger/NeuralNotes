import { combineReducers } from 'redux';

import { appReducer } from 'components/App/AppReducer'
import { notesReducer } from 'components/NotesPage/NotesPageReducer';

export const reducers = combineReducers({
  app: appReducer,
  notes: notesReducer,
});
