import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import { loginPageReducer } from 'components/LoginPage/LoginPageReducer';
import { noteDetailsReducer } from 'components/NoteDetails/NoteDetailsReducer';
import { notesMindMapReducer } from 'components/NotesMindMap/NotesMindMapReducer';
import { searchPageReducer } from 'components/SearchPage/SearchPageReducer';
import { uploadsReducer } from 'components/Uploads/UploadsReducer';

export const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    login: loginPageReducer,
    noteDetails: noteDetailsReducer,
    notesMindMap: notesMindMapReducer,
    searchPage: searchPageReducer,
    [uploadsReducer.KEY]: uploadsReducer,
  });
