import { toast } from 'react-toastify';

import noteStorage from 'storage/noteStorage';
import {
  all,
  put,
  call,
  takeEvery,
} from 'redux-saga/dist/redux-saga-effects-npm-proxy.cjs';
import { apiCall } from 'api/api';

import {
  searchRequestSuccess,
  searchRequestAction,
  SEARCH_QUERY_CHANGED_ACTION,
} from 'components/SearchPage/SearchPageAction';

function* handleSearchQueryChange({ data }) {
  const query = data;
  if (query !== '') {
    yield put(searchRequestAction(query));
    try {
      const results = yield apiCall(
        noteStorage.findNotesAndFilesBySubstring,
        query,
      );
      yield put(searchRequestSuccess(results));
    } catch (error) {
      console.error(error);
      yield call(toast.error, 'Failed to perform search request');
    }
  }
}

export function* searchPageInit() {
  yield all([takeEvery(SEARCH_QUERY_CHANGED_ACTION, handleSearchQueryChange)]);
}
