import { gapiAuthorize } from 'api/google-login';
import { toast } from 'react-toastify';
import {
  call,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import {
  NOT_AUTHORIZED_USER_OPENED_APP,
  loadGoogleApiAction,
} from 'components/App/AppActions';

import {
  REQUEST_AUTHORIZATION_ACTION,
  authSuccessAction,
  AUTH_SUCCESS_ACTION,
} from 'components/LoginPage/LoginPageActions';

import { saveUserLoginEvent } from 'api/eventsApi';

export function* handleAuth() {
  try {
    const user = yield call(gapiAuthorize);
    yield put(authSuccessAction(user));
  } catch (e) {
    console.error('googleLogin.gapiAuthorize(): authError: ', e);
    yield call(
      [toast, toast.error],
      'Google Authentification failed: ' + e.error,
    );
  }
}

function* handleNotAuthorizedUserOpenedApp() {
  yield put(loadGoogleApiAction());
}

function* handleAuthSuccess({ data: user }) {
  try {
    yield saveUserLoginEvent(user);
  } catch (e) {
    // Don't crash the app if saving an event failed, as it's not critical
    console.log(e);
  }
}

export function* loginInit() {
  yield takeEvery(
    NOT_AUTHORIZED_USER_OPENED_APP,
    handleNotAuthorizedUserOpenedApp,
  );
  yield takeEvery(REQUEST_AUTHORIZATION_ACTION, handleAuth);
  yield takeEvery(AUTH_SUCCESS_ACTION, handleAuthSuccess);
}
