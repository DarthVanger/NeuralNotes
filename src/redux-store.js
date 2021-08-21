import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createRootReducer } from 'reducers';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import reduxCatch from 'redux-catch';

import { rootSaga } from './sagas.js';
import { saveNotesMindMapToLocalStorageOnReduxStoreChange } from 'storage/notesMindMapLocalStorage';
import { unexpectedErrorAction } from 'components/App/AppActions';

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

const reduxErrorHandler = (error, getState, lastAction, dispatch) => {
  console.error(error);
  dispatch(unexpectedErrorAction(error));
};

const sagaMiddleware = createSagaMiddleware({
  onError: error => {
    console.error(error);
    store.dispatch(unexpectedErrorAction(error));
  },
});

export const history = createBrowserHistory();

const configureStore = preloadedState => {
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancers(
      applyMiddleware(reduxCatch(reduxErrorHandler)),
      applyMiddleware(sagaMiddleware),
      applyMiddleware(routerMiddleware(history)),
    ),
  );

  return store;
};

export const store = configureStore();

sagaMiddleware.run(rootSaga);

store.subscribe(() => saveNotesMindMapToLocalStorageOnReduxStoreChange(store));

export const makeAction = (type, data = null) => store.dispatch({ type, data });
