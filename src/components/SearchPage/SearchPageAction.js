export const SEARCH_QUERY_CHANGED_ACTION = 'SEARCH_QUERY_CHANGED_ACTION';
export const SEARCH_REQUEST_SUCCESS = 'SEARCH_REQUEST_SUCCESS';

export const searchQueryChangeAction = data => {
  return {
    type: SEARCH_QUERY_CHANGED_ACTION,
    data,
  };
};

export const searchRequestSuccess = data => ({
  type: SEARCH_REQUEST_SUCCESS,
  data,
});
