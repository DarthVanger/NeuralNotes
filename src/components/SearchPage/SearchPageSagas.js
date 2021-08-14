import noteStorage from 'storage/noteStorage';
import {
  all,
  put,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';

import {
  searchRequestSuccess,
  searchRequestAction,
  SEARCH_QUERY_CHANGED_ACTION,
} from 'components/SearchPage/SearchPageAction';

function* handleSearchQueryChange({ data }) {
  const query = data;
  if (query !== '') {
    yield put(searchRequestAction(query));
    const results = yield noteStorage.findNotesByName(query);
    yield put(searchRequestSuccess(results));
  }
}

export function* searchPageInit() {
  yield all([takeEvery(SEARCH_QUERY_CHANGED_ACTION, handleSearchQueryChange)]);
}
