import {
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';

const SHOW_SPINNER_ACTION = 'SHOW_SPINNER_ACTION';
const HIDE_SPINNER_ACTION = 'HIDE_SPINNER_ACTION';

const spinner = siteGlobalLoadingBar.create();
spinner.hide();

export function* showSpinner(data) {
  yield put({ type: SHOW_SPINNER_ACTION, data });
}

export function* hideSpinner() {
  yield put({ type: HIDE_SPINNER_ACTION });
}

export function* spinnerInit() {
  yield takeEvery(SHOW_SPINNER_ACTION, ({ data }) => spinner.show(data));
  yield takeEvery(HIDE_SPINNER_ACTION, () => spinner.hide());
}
