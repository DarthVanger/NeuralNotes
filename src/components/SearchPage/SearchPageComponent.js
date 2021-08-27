import React from 'react';

import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import InsertDriveFileRoundedIcon from '@material-ui/icons/InsertDriveFileRounded';
import DescriptionIcon from '@material-ui/icons/Description';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from 'colors';
import { searchResultClickedAction } from 'components/NotesMindMap/NotesMindMapActions';
import { TopBarLeftButtons } from 'components/TopBar/TopBarLeftButtons';
import { TopBar } from 'components/TopBar/TopBar';
import SearchInputComponent from './SearchInput';
import { BackButton } from 'components/BackButton/BackButton';
import noteStorage from 'storage/noteStorage';
const useStyles = makeStyles(() => ({
  page: {
    minHeight: '100%',
    background: colors.elevationOverlay02dp,
  },
  listItem: {
    padding: '1em',
  },
  icon: {
    // reset Mui's 56px min-width
    minWidth: 'initial',
    marginRight: '12px',
  },
  svgIcon: {
    color: colors.onSurfaceMediumEmphasis,
  },
}));

export function SearchPageComponent() {
  const searchResults = useSelector(state => state.searchPage.results);
  const areSearchResultsFetched = useSelector(
    state => state.searchPage.areSearchResultsFetched,
  );

  const isSearchRequestInProgress = useSelector(
    state => state.searchPage.isSearchRequestInProgress,
  );

  const dispatch = useDispatch();

  const handleClick = searchResult => {
    dispatch(searchResultClickedAction(searchResult));
  };

  const classes = useStyles();

  const noResultsFound = areSearchResultsFetched && searchResults.length === 0;

  const FileIcon = () => (
    <ListItemIcon className={classes.icon}>
      <InsertDriveFileRoundedIcon className={classes.svgIcon} />
    </ListItemIcon>
  );

  const NoteIcon = () => (
    <ListItemIcon className={classes.icon}>
      <DescriptionIcon className={classes.svgIcon} />
    </ListItemIcon>
  );

  return (
    <div className={classes.page}>
      <TopBar>
        <TopBarLeftButtons>
          <BackButton to={'notes'} />
        </TopBarLeftButtons>
        <SearchInputComponent />
      </TopBar>

      <List>
        {searchResults &&
          searchResults.map(searchResult => (
            <React.Fragment key={searchResult.id}>
              <ListItem
                button
                className={classes.listItem}
                onClick={() => handleClick(searchResult)}>
                {noteStorage.isUploadedFile(searchResult) ? (
                  <FileIcon />
                ) : (
                  <NoteIcon />
                )}
                <ListItemText>
                  <Typography variant="subtitle1">
                    {searchResult.name}
                  </Typography>
                </ListItemText>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        {noResultsFound && (
          <ListItem className={classes.listItem}>
            None of your notes or files mathed this search
          </ListItem>
        )}
        {isSearchRequestInProgress && (
          <ListItem className={classes.listItem}>Searching...</ListItem>
        )}
      </List>
    </div>
  );
}
