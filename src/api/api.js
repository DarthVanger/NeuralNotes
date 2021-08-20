import {
  put,
  take,
  call,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import { didSessionExpire } from 'auth';
import {
  attemptToCallApiWithExpiredTokenAction,
  SESSION_REFRESH_SUCCESS_ACTION,
} from './apiActions';

export function* apiCall(fn, ...args) {
  if (didSessionExpire()) {
    yield put(attemptToCallApiWithExpiredTokenAction());
    yield take(SESSION_REFRESH_SUCCESS_ACTION);
  }
  return yield call(fn, ...args);
}
