import { combineReducers } from 'redux';

import { appReducer } from 'components/App/AppReducer'
import { notesReducer } from 'components/NotesPage/NotesPageReducer';
import { notesMindMapReducer } from 'components/NotesMindMapView/NotesMindMapViewReducer';
import { searchPanelReducer } from 'components/SearchPanel/SearchPanelReducer';

export const reducers = combineReducers({
  app: appReducer,
  notes: notesReducer,
  notesMindMap: notesMindMapReducer,
  searchPanel: searchPanelReducer,
});
