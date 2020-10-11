import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { searchQueryChangeAction } from '../SearchPage/SearchPageAction';
import { searchResultClickedAction } from 'components/NotesMindMap/NotesMindMapActions';

export function SearchPageComponent() {
  const searchResults = useSelector(state => state.searchPage.results);
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

  const handleClick = searchResult => {
    const note = { ...searchResult, label: searchResult.name };
    dispatch(searchResultClickedAction({ note }));
  };

  return (
    <div>
      <input
        defaultValue={defaultValue}
        onChange={e => debounced.callback(e.target.value, setQuery)}
      />
      {searchResults &&
        searchResults.map(searchResult => (
          <>
            <h2
              style={{ 'border-top': '1px solid black' }}
              onClick={() => handleClick(searchResult)}>
              {searchResult.name}
            </h2>
          </>
        ))}
    </div>
  );
}
