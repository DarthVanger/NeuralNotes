import { all } from 'redux-saga/effects'
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from 'reducers/rootReducer';
import { applyMiddleware, createStore } from 'redux';
import { spinnerInit } from 'components/Spinner/SpinnerSagas';
import { appInit } from 'components/App/AppSagas';
import { loginInit } from 'components/LoginPage/LoginPageSagas';

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export const action = (type, data = null) => store.dispatch({ type, data });

export function* rootSaga() {
  yield all([
    appInit(),
    spinnerInit(),
    loginInit()
  ])
}
