import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import { loginReducer } from 'components/LoginPage/LoginPageSlice';
import { noteDetailsReducer } from 'components/NoteDetails/NoteDetailsReducer';
import { notesMindMapReducer } from 'components/NotesMindMap/NotesMindMapReducer';
import { notesReducer } from 'components/NotesPage/NotesPageReducer';
import { searchPageReducer } from 'components/SearchPage/SearchPageReducer';
import { uploadsReducer } from 'components/Uploads/UploadsReducer';

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
