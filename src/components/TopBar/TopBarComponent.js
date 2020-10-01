import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useDispatch } from 'react-redux';
import { PAGES_ENUM } from 'components/App/AppConstants';
import { CHANGE_PAGE_ACTION } from 'components/App/AppActions';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const setPageActionHooks = data => {
  return {
    type: CHANGE_PAGE_ACTION,
    data,
  };
};

export function TopBarComponent() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const showSearchPanel = () => {
    dispatch(setPageActionHooks(PAGES_ENUM.SEARCH));
  };

  return (
    <div className={classes.root}>
      <AppBar style={{ background: '#272727' }} position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography
            style={{ color: '#BB86FC' }}
            variant="h6"
            className={classes.title}>
            Neural Notes
          </Typography>
          <CloudUploadIcon
            style={{ color: '#BB86FC', 'margin-right': '10px' }}
          />
          <SearchIcon onClick={showSearchPanel} />
        </Toolbar>
      </AppBar>
    </div>
  );
}
