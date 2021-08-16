import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createRootReducer } from 'reducers';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { sagaMiddleware, runSaga } from './sagas.js';
import { saveNotesMindMapToLocalStorageOnReduxStoreChange } from 'storage/notesMindMapLocalStorage';

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

runSaga();

store.subscribe(() => saveNotesMindMapToLocalStorageOnReduxStoreChange(store));

export const makeAction = (type, data = null) => store.dispatch({ type, data });
