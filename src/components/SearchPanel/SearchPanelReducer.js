import { SEARCH_QUERY_CHANGED_ACTION } from 'components/SearchPanel/SearchPanelActions';

const defaultState = {
  query: '',
};

export const searchPanelReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case SEARCH_QUERY_CHANGED_ACTION:
      return { ...state, query: data };

    default:
      return state;
  }
};
