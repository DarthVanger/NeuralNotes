export const SEARCH_QUERY_CHANGED_ACTION = 'SEARCH_QUERY_CHANGED_ACTION';

export const searchQueryChangeAction = data => {
  return {
    type: SEARCH_QUERY_CHANGED_ACTION,
    data,
  };
};
