import { all, call, put, takeEvery } from 'redux-saga/effects';

import { gapiAuthorize } from 'api/google-login';
import { REFRESH_SESSION_BUTTON_CLICKED_ACTION } from './SessionExpiredDialogActions';
import { sesssionRefreshSuccessAction } from 'api/apiActions';

function* handleRefreshSessionButtonClicked() {
  yield call(gapiAuthorize);
  yield put(sesssionRefreshSuccessAction());
}

export function* sessionExpiredDialogInit() {
  yield all([
    takeEvery(
      REFRESH_SESSION_BUTTON_CLICKED_ACTION,
      handleRefreshSessionButtonClicked,
    ),
  ]);
}
