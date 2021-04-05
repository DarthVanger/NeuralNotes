import * as googleApi from 'api/googleApi';
import auth from 'auth';
import { toast } from 'react-toastify';
import {
  put,
  call,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import {
  LOAD_GOOGLE_API_ACTION,
  authorizedUserOpenedApp,
  notAuthorizedUserOpenedApp,
} from './AppActions';

import { loadGoogleApiSuccessAction } from 'components/LoginPage/LoginPageActions';

export function* loadGoogleApi() {
  yield googleApi.loadGoogleApi();
  yield put(loadGoogleApiSuccessAction());
}

export function* appInit() {
  yield call([toast, toast.configure], {
    position: toast.POSITION.BOTTOM_RIGHT,
  });

  yield takeEvery(LOAD_GOOGLE_API_ACTION, loadGoogleApi);

  if (!auth.signedIn()) {
    yield put(notAuthorizedUserOpenedApp());
  } else {
    yield put(authorizedUserOpenedApp());
  }
}
