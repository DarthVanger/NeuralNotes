import {
  all,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import {
  searchRequestSuccess,
  SEARCH_QUERY_CHANGED_ACTION,
} from 'components/SearchPage/SearchPageAction';
import googleDriveApi from 'api/google-drive-api';

function* searchNoteSaga({ data }) {
  const results = yield googleDriveApi.findNotesByName(data);
  yield put(searchRequestSuccess(results));
}

export function* searchPageInit() {
  yield all([takeEvery(SEARCH_QUERY_CHANGED_ACTION, searchNoteSaga)]);
}
