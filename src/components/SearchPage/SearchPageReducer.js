import { SEARCH_QUERY_CHANGED_ACTION } from 'components/SearchPage/SearchPageAction';

const defaultState = {
  query: '',
};

export const searchPageReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case SEARCH_QUERY_CHANGED_ACTION:
      return { ...state, query: data };

    default:
      return state;
  }
};
