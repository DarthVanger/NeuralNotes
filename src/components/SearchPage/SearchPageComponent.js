import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { searchQueryChangeAction } from '../SearchPage/SearchPageAction';
import { searchResultClickedAction } from 'components/NotesMindMap/NotesMindMapActions';

import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InsertDriveFileRoundedIcon from '@material-ui/icons/InsertDriveFileRounded';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'colors';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';

const BackButtonWrapper = styled.div`
  color: red !important;
  padding: 1rem;
`;

const useStyles = makeStyles(() => ({
  list: {
    width: '100%',
    height: '100%',
    paddingLeft: 16,
  },
  listItem: {
    padding: 0,
    height: 64,
  },
  icon: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  svgIcon: {
    color: colors.iconColor,
  },
}));

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

  const classes = useStyles();

  return (
    <>
      <BackButtonWrapper>
        <Link to="notes">
          <IconButton aria-label="back">
            <ArrowBackIcon style={{ fill: '#BB86FC' }} />
          </IconButton>
        </Link>
      </BackButtonWrapper>
      <input
        defaultValue={defaultValue}
        onChange={e => debounced.callback(e.target.value, setQuery)}
      />
      <List className={classes.list}>
        {searchResults &&
          searchResults.map(searchResult => (
            <>
              <ListItem key={searchResult.id} className={classes.listItem}>
                <ListItemIcon className={classes.icon}>
                  <InsertDriveFileRoundedIcon className={classes.svgIcon} />
                </ListItemIcon>
                <ListItemText onClick={() => handleClick(searchResult)}>
                  <Typography variant="subtitle1">
                    {searchResult.name}
                  </Typography>
                </ListItemText>
              </ListItem>
              <Divider component="li" />
            </>
          ))}
      </List>
    </>
  );
}
