import noteStorage from 'storage/noteStorage';
import {
  all,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import {
  searchRequestSuccess,
  SEARCH_QUERY_CHANGED_ACTION,
} from 'components/SearchPage/SearchPageAction';

function* searchNoteSaga({ data }) {
  const results = yield noteStorage.findNotesByName(data);
  yield put(searchRequestSuccess(results));
}

export function* searchPageInit() {
  yield all([takeEvery(SEARCH_QUERY_CHANGED_ACTION, searchNoteSaga)]);
}
