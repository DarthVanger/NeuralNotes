import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import {
  put,
  call,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import * as googleApi from 'api/googleApi';
import auth from 'auth';
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

function* handleLocationChange({ payload }) {
  // if user refreshes page while changing parent note, or while creating or editing a note,
  // redirect to the mind map, as those pages rely on data passed from mind map via actions.
  if (payload.isFirstRendering) {
    const {
      location: { pathname },
    } = payload;

    if (pathname.includes('/notes/change-parent')) {
      yield put(push('/notes'));
    }

    if (pathname.includes('/note/')) {
      yield put(push('/notes'));
    }
  }
}

export function* appInit() {
  yield call([toast, toast.configure], {
    position: toast.POSITION.BOTTOM_RIGHT,
  });

  yield takeEvery(LOAD_GOOGLE_API_ACTION, loadGoogleApi);
  yield takeEvery('@@router/LOCATION_CHANGE', handleLocationChange);

  if (!auth.signedIn()) {
    yield put(notAuthorizedUserOpenedApp());
  } else {
    yield put(authorizedUserOpenedApp());
  }
}
