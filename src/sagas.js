import { all, fork } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import { reducers } from 'reducers';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { spinnerInit } from 'components/Spinner/SpinnerSagas';
import { appInit } from 'components/App/AppSagas';
import { loginInit } from 'components/LoginPage/LoginPageSagas';
import { notesInit } from 'components/NotesPage/NotesPageSagas';
import { notesContentEditorInit } from 'components/NotesContentEditor/NotesContentEditorSagas';
import { noteMindMapInit } from 'components/NotesMindMap/NotesMindMapSagas';
import { attachmentsInit } from 'components/Uploads/AttachmentsSagas';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = composeWithDevTools({
  serialize: {
    replacer: (__, value) => {
      if (value instanceof File) {
        // we want to see files in the redux-dev-tools
        return value.name;
      }

      return value;
    },
  },
});

export const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(rootSaga);

export const action = (type, data = null) => store.dispatch({ type, data });

export function* rootSaga() {
  yield all([
    appInit(),
    spinnerInit(),
    loginInit(),
    notesInit(),
    noteMindMapInit(),
    notesContentEditorInit(),
    fork(attachmentsInit),
  ]);
}
