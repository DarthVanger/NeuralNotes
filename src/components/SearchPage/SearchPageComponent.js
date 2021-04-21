import React, { useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
import { colors } from 'colors';
import { searchResultClickedAction } from 'components/NotesMindMap/NotesMindMapActions';
import { searchQueryChangeAction } from '../SearchPage/SearchPageAction';
import { NotFound } from 'components/NotFound/NotFoundComponent';
import { SearchList } from 'components/SearchList/SearchList';

const BackButtonWrapper = styled.div`
  background: ${colors.darkGray} !important;
  padding: 1rem;
`;

const Container = styled.div`
  color: red !important;
  width: 100%;
  height: 100%;
`;

const InputWrapper = styled.div`
  padding-left: 20px;
`;

export function SearchPageComponent() {
  const resultList = useSelector(state => state.searchPage.results);
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

  const responseList =
    resultList?.length || !query ? (
      <SearchList handleItemClick={handleClick} resultList={resultList} />
    ) : (
      <NotFound />
    );

  return (
    <Container>
      <BackButtonWrapper>
        <Link to="notes">
          <IconButton aria-label="back">
            <ArrowBackIcon style={{ fill: '#BB86FC' }} />
          </IconButton>
        </Link>
      </BackButtonWrapper>
      <InputWrapper>
        <input
          defaultValue={defaultValue}
          onChange={e => debounced.callback(e.target.value, setQuery)}
        />
      </InputWrapper>
      {responseList}
    </Container>
  );
}
