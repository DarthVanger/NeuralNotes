import { combineReducers } from 'redux';

import { appReducer } from 'components/App/AppReducer';
import { notesReducer } from 'components/NotesPage/NotesPageReducer';
import { notesMindMapReducer } from 'components/NotesMindMap/NotesMindMapReducer';
import { searchPanelReducer } from 'components/SearchPanel/SearchPanelReducer';
import { uploadsReducer } from 'components/Uploads/UploadsReducer';
import { noteDetailsReducer } from 'components/NoteDetails/NoteDetailsReducer';

export const reducers = combineReducers({
  app: appReducer,
  notes: notesReducer,
  neteDetails: noteDetailsReducer,
  notesMindMap: notesMindMapReducer,
  searchPanel: searchPanelReducer,
  [uploadsReducer.KEY]: uploadsReducer,
});
