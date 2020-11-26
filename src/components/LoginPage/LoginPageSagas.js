import googleApiLoader from 'api/google-api-loader';
import { gapiAuthorize } from 'api/google-login';
import { toast } from 'react-toastify';
import {
  call,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';

import {
  googleApiInitializedAction,
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

export function* loginInit() {
  yield googleApiLoader.load();
  yield put(googleApiInitializedAction());
  yield takeEvery(REQUEST_AUTHORIZATION_ACTION, handleAuth);
}
