import { call, put, takeEvery } from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import thoughtStorage from 'storage/thought-storage';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import googleDriveApi from 'api/google-drive-api';
import { gapiAuthorize } from 'api/google-login';
import { googleApiInitializedAction, REQUEST_AUTHORIZATION } from 'components/LoginPage/LoginPagesActions';
import { PAGES_ENUM } from 'components/App/AppConstants';
import { setPageAction } from 'components/App/AppSagas';
import googleApiLoader from 'api/google-api-loader';

export function* handleAuth() {
  const spinnerName = 'Loading google auth';

  yield call(siteGlobalLoadingBar.show, spinnerName);
  yield gapiAuthorize();
  yield call(siteGlobalLoadingBar.hide, spinnerName);
  yield call(googleDriveApi.loadDriveApi);
  yield call(thoughtStorage.scanDrive);
  yield setPageAction(PAGES_ENUM.NOTES);
}

export function* loginInit() {
  yield googleApiLoader.load();
  yield put(googleApiInitializedAction());
  yield takeEvery(REQUEST_AUTHORIZATION, handleAuth);
}
