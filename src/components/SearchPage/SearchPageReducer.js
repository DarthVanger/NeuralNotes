import {
  SEARCH_QUERY_CHANGED_ACTION,
  SEARCH_REQUEST_SUCCESS,
} from 'components/SearchPage/SearchPageAction';

const defaultState = {
  query: '',
  results: [],
  areSearchResultsFetched: false,
};

export const searchPageReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case SEARCH_QUERY_CHANGED_ACTION:
      return {
        ...state,
        query: data,
        areSearchResultsFetched: false,
      };
    case SEARCH_REQUEST_SUCCESS:
      return {
        ...state,
        results: data,
        areSearchResultsFetched: true,
      };
    default:
      return state;
  }
};
