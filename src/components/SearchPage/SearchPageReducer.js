import {
  SEARCH_QUERY_CHANGED_ACTION,
  SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST,
} from 'components/SearchPage/SearchPageAction';

const defaultState = {
  query: '',
  results: [],
  isSearchRequestInProgress: false,
  areSearchResultsFetched: false,
};

export const searchPageReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case SEARCH_QUERY_CHANGED_ACTION:
      return {
        ...state,
        query: data,
      };
    case SEARCH_REQUEST:
      return {
        ...state,
        isSearchRequestInProgress: true,
        areSearchResultsFetched: false,
        results: [],
      };
    case SEARCH_REQUEST_SUCCESS:
      return {
        ...state,
        results: data,
        isSearchRequestInProgress: false,
        areSearchResultsFetched: true,
      };
    default:
      return state;
  }
};
