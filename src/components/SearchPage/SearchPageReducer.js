import {
  SEARCH_QUERY_CHANGED_ACTION,
  SEARCH_REQUEST_SUCCESS,
} from 'components/SearchPage/SearchPageAction';

const defaultState = {
  query: '',
  results: [],
};

export const searchPageReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case SEARCH_QUERY_CHANGED_ACTION:
      return { ...state, query: data };
    case SEARCH_REQUEST_SUCCESS:
      return { ...state, results: data };
    default:
      return state;
  }
};
