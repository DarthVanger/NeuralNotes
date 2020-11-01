import auth from 'auth';
import {
  call,
  all,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import { LOGOUT_ACTION } from 'components/LogoutButton/LogoutButtonAction';

function* logout() {
  console.log('logout');
  localStorage.clear();
  yield call(auth.logout);
}

export function* logoutButtonInit() {
  yield all([takeEvery(LOGOUT_ACTION, logout)]);
}
