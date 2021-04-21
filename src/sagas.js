import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createRootReducer } from 'reducers';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import { appInit } from 'components/App/AppSagas';
import { loginInit } from 'components/LoginPage/LoginPageSagas';
import { logoutInit } from 'components/NotesPage/NotesPageTopBar/NotesPageTopBarSagas';
import { noteDetailsInit } from 'components/NoteDetails/NoteDetailsSagas';
import { noteMindMapInit } from 'components/NotesMindMap/NotesMindMapSagas';
import { searchPageInit } from 'components/SearchPage/SearchPageSagas';
import { spinnerInit } from 'components/Spinner/SpinnerSagas';
import { uploadsInit } from 'components/Uploads/UploadsSagas';
import { bottomBarInit } from 'components/BottomBar/BottomBarSagas';
import { notesPageInit } from 'components/NotesPage/NotesPageSagas';

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

sagaMiddleware.run(rootSaga);

export const action = (type, data = null) => store.dispatch({ type, data });

export function* rootSaga() {
  yield all([
    appInit(),
    spinnerInit(),
    loginInit(),
    logoutInit(),
    noteMindMapInit(),
    uploadsInit(),
    noteDetailsInit(),
    searchPageInit(),
    bottomBarInit(),
    notesPageInit(),
  ]);
}
