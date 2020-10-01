import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { searchQueryChangeAction } from '../SearchPage/SearchPageAction';

export function SearchPageComponent() {
  const results = useSelector(state => state.searchPage.results);
  const dispatch = useDispatch();
  const defaultValue = '';
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    dispatch(searchQueryChangeAction(query));
  }, [query]);

  const debounced = useDebouncedCallback(
    (value, setQuery) => setQuery(value),
    1000,
  );

  return (
    <div>
      <input
        defaultValue={defaultValue}
        onChange={e => debounced.callback(e.target.value, setQuery)}
      />
      {results &&
        results.map(result => (
          <>
            <h2>{result.name}</h2>
            <h3>{result.mimeType}</h3>
          </>
        ))}
    </div>
  );
}
