import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { loginReducer } from 'components/LoginPage/LoginSlice';
import { notesReducer } from 'components/NotesPage/NotesPageReducer';
import { notesMindMapReducer } from 'components/NotesMindMap/NotesMindMapReducer';
import { searchPageReducer } from 'components/SearchPage/SearchPageReducer';
import { uploadsReducer } from 'components/Uploads/UploadsReducer';
import { noteDetailsReducer } from 'components/NoteDetails/NoteDetailsReducer';

export const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    login: loginReducer,
    notes: notesReducer,
    noteDetails: noteDetailsReducer,
    notesMindMap: notesMindMapReducer,
    searchPage: searchPageReducer,
    [uploadsReducer.KEY]: uploadsReducer,
  });
