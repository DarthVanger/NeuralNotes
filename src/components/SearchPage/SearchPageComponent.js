import React from 'react';

import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import InsertDriveFileRoundedIcon from '@material-ui/icons/InsertDriveFileRounded';
import { colors } from 'colors';
import { useDispatch, useSelector } from 'react-redux';

import { searchResultClickedAction } from 'components/NotesMindMap/NotesMindMapActions';

import { TopBarLeftButtons } from 'components/TopBar/TopBarLeftButtons';
import { TopBar } from 'components/TopBar/TopBar';
import SearchInputComponent from './SearchInput';
import { BackButton } from 'components/BackButton/BackButton';
const useStyles = makeStyles(() => ({
  list: {
    width: '100%',
    height: '100vh',
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
    color: colors.textColor,
  },
}));

export function SearchPageComponent() {
  const searchResults = useSelector(state => state.searchPage.results);
  const dispatch = useDispatch();

  const handleClick = searchResult => {
    const note = { ...searchResult, label: searchResult.name };
    dispatch(searchResultClickedAction({ note }));
  };

  const classes = useStyles();

  return (
    <>
      <TopBar>
        <TopBarLeftButtons>
          <BackButton to={'notes'} />
        </TopBarLeftButtons>
        <SearchInputComponent />
      </TopBar>

      <List className={classes.list}>
        {searchResults &&
          searchResults.map(searchResult => (
            <React.Fragment key={searchResult.id}>
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
