import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InsertDriveFileRoundedIcon from '@material-ui/icons/InsertDriveFileRounded';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'colors';

const useStyles = makeStyles(() => ({
  list: {
    width: '100%',
    height: 'calc(100% - 101px)',
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

export const SearchList = ({ resultList, handleItemClick }) => {
  const styleClasses = useStyles();

  return (
    <List className={styleClasses.list}>
      {resultList.map(searchResult => (
        <ListItem key={searchResult.id} className={styleClasses.listItem}>
          <ListItemIcon className={styleClasses.icon}>
            <InsertDriveFileRoundedIcon className={styleClasses.svgIcon} />
          </ListItemIcon>
          <ListItemText onClick={() => handleItemClick(searchResult)}>
            <Typography variant="subtitle1">{searchResult.name}</Typography>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};
