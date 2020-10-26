import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { appReducer } from 'components/App/AppReducer';
import { notesReducer } from 'components/NotesPage/NotesPageReducer';
import { notesMindMapReducer } from 'components/NotesMindMap/NotesMindMapReducer';
import { searchPageReducer } from 'components/SearchPage/SearchPageReducer';
import { uploadsReducer } from 'components/Uploads/UploadsReducer';
import { noteDetailsReducer } from 'components/NoteDetails/NoteDetailsReducer';

// export const reducers = combineReducers({
//   app: appReducer,
//   notes: notesReducer,
//   noteDetails: noteDetailsReducer,
//   notesMindMap: notesMindMapReducer,
//   searchPage: searchPageReducer,
//   [uploadsReducer.KEY]: uploadsReducer,
// });

export const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    app: appReducer,
    notes: notesReducer,
    noteDetails: noteDetailsReducer,
    notesMindMap: notesMindMapReducer,
    searchPage: searchPageReducer,
    [uploadsReducer.KEY]: uploadsReducer,
  });
