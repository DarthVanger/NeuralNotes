import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { colors } from 'colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/core/styles';
import useUser from 'components/LoginPage/useUser';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ContactIcons from 'components/LoginPage/ContactIcons';

import Drawer from '@material-ui/core/Drawer';

const useStyles = makeStyles(theme => ({
  list: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '250px',
  },
  listGutter: {
    flexGrow: 1,
  },
  feedbackListItem: {
    justifyContent: 'center',
  },
  feedbackIsWelcome: {
    paddingTop: '0',
    marginTop: '-0.5rem',
    justifyContent: 'center',
  },
  logoutIcon: {
    transform: 'rotate(180deg)',
  },
  accountIcon: {
    fontSize: '2em',
    marginRight: '0.25em',
  },
  accountListItem: {
    background: theme.palette.primary.main,
    color: colors.onPrimaryHighEmphasis,
  },
  email: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

import { logoutAction } from './NotesPageTopBarAction';
import { useDispatch } from 'react-redux';

export function NotesPageTopBarMenu() {
  const user = useUser();
  const classes = useStyles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(logoutAction());
  };

  const handleMenuIconClick = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleMenuIconClick}
        edge="start"
        aria-label="menu"
        aria-controls="burger-menu">
        <MenuIcon style={{ color: colors.onSurfaceHighEmphasis }} />
      </IconButton>
      <Drawer open={isMenuOpen} onClose={handleMenuClose}>
        <List className={classes.list}>
          <ListItem className={classes.accountListItem}>
            <AccountCircleIcon className={classes.accountIcon} />
            <Typography
              variant="subtitle1"
              color="inherit"
              className={classes.email}>
              {user.email}
            </Typography>
          </ListItem>
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <ExitToAppIcon className={classes.logoutIcon} />
            </ListItemIcon>
            <Typography variant="subtitle1">Logout</Typography>
          </ListItem>
          <ListItem className={classes.listGutter}></ListItem>
          <ListItem className={classes.feedbackListItem}>
            <ContactIcons />
          </ListItem>
          <ListItem className={classes.feedbackIsWelcome}>
            <Typography variant="subtitle2">Feedback is welcome</Typography>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
