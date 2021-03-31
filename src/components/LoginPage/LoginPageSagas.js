import { gapiAuthorize } from 'api/google-login';
import { toast } from 'react-toastify';
import {
  call,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import {
  NOT_AUTHORIZED_USER_OPENED_APP,
  loadGoogleApiAction,
} from 'components/App/AppActions';

import {
  REQUEST_AUTHORIZATION_ACTION,
  authSuccessAction,
} from 'components/LoginPage/LoginPageActions';

export function* handleAuth() {
  const spinnerName = 'Loading google auth';

  yield call(siteGlobalLoadingBar.show, spinnerName);
  try {
    yield gapiAuthorize();
    yield put(authSuccessAction());
  } catch (e) {
    console.error('googleLogin.gapiAuthorize(): authError: ', e);
    yield call(
      [toast, toast.error],
      'Google Authentification failed: ' + e.error,
    );
  }

  yield call(siteGlobalLoadingBar.hide, spinnerName);
}

function* handleNotAuthorizedUserOpenedApp() {
  yield put(loadGoogleApiAction());
}

export function* loginInit() {
  yield takeEvery(
    NOT_AUTHORIZED_USER_OPENED_APP,
    handleNotAuthorizedUserOpenedApp,
  );
  yield takeEvery(REQUEST_AUTHORIZATION_ACTION, handleAuth);
}
