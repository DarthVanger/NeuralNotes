import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import { createRootReducer } from 'reducers';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createBrowserHistory } from 'history';
// import { compose } from 'redux';

import { routerMiddleware } from 'connected-react-router';

import { spinnerInit } from 'components/Spinner/SpinnerSagas';
import { appInit } from 'components/App/AppSagas';
import { loginInit } from 'components/LoginPage/LoginPageSagas';
import { logoutButtonInit } from 'components/LogoutButton/LogoutButtonSagas';
// import { notesInit } from 'components/NotesPage/NotesPageSagas';
import { notesContentEditorInit } from 'components/NotesContentEditor/NotesContentEditorSagas';
import { noteMindMapInit } from 'components/NotesMindMap/NotesMindMapSagas';
import { uploadsInit } from 'components/Uploads/UploadsSagas';
import { noteDetailsInit } from 'components/NoteDetails/NoteDetailsSagas';
import { searchPageInit } from 'components/SearchPage/SearchPageSagas';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = composeWithDevTools({
  serialize: {
    replacer: (__, value) => {
      if (value instanceof File) {
        // we want to see files in the redux-dev-tools
        return {
          filename: value.name,
          uploadFolderId: value.uploadFolderId,
        };
      }

      return value;
    },
  },
});

export const history = createBrowserHistory();

const configureStore = preloadedState => {
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancers(
      applyMiddleware(sagaMiddleware),
      applyMiddleware(routerMiddleware(history)),
    ),
  );

  return store;
};

export const store = configureStore();

// export const store = createStore(
//   reducers,
//   composeEnhancers(applyMiddleware(sagaMiddleware)),
// );

sagaMiddleware.run(rootSaga);

export const action = (type, data = null) => store.dispatch({ type, data });

export function* rootSaga() {
  yield all([
    appInit(),
    spinnerInit(),
    loginInit(),
    logoutButtonInit(),
    // notesInit(),
    noteMindMapInit(),
    notesContentEditorInit(),
    uploadsInit(),
    noteDetailsInit(),
    searchPageInit(),
  ]);
}
