import React, { useEffect, useState } from 'react';

import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InsertDriveFileRoundedIcon from '@material-ui/icons/InsertDriveFileRounded';
import { colors } from 'colors';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
import ClearIcon from '@material-ui/icons/Clear';

import { searchResultClickedAction } from 'components/NotesMindMap/NotesMindMapActions';

import { searchQueryChangeAction } from '../SearchPage/SearchPageAction';

const BackButtonWrapper = styled.div`
  color: red !important;
  padding: 1rem;
  background-color: #2b2630;
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
  clearIcon: {
    color: colors.iconColor,
    marginLeft: -30,
    marginBottom: -5,
  },
}));
const MyInput = styled.input`
  margin-left: 20px;
  border-radius: 5px;
  border: 2px solid rgb(204, 135, 250);
  height: 40px;
  outline: none;
  background-color: rgba(255, 255, 255, 0.07);
  font-size: 20px;
  color: ${colors.white87};
  &:hover {
    box-shadow: 0 0 3px ${colors.white87};
  }
`;

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
    100,
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
        <MyInput
          placeholder="Search input"
          value={query}
          onChange={e => debounced.callback(e.target.value, setQuery)}
        />
        <ClearIcon
          className={classes.clearIcon}
          onClick={() => setQuery(query.slice(0, -1))}
        />
      </BackButtonWrapper>
      <List className={classes.list}>
        {searchResults &&
          searchResults.map((searchResult, key) => (
            <React.Fragment key={key}>
              <ListItem className={classes.listItem}>
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
            </React.Fragment>
          ))}
      </List>
    </>
  );
}
