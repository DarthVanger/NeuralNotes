import React from 'react';
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
import { LogoutButtonContainer } from 'components/LogoutButton/LogoutButtonContainer';
import styled from 'styled-components';

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

const TopBarWrapper = styled.div`
  display: flex;
  height: 5rem;
`;

export function TopBarComponent() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const showSearchPanel = () => {
    dispatch(setPageActionHooks(PAGES_ENUM.SEARCH));
  };

  return (
    <TopBarWrapper>
      <AppBar style={{ background: '#272727' }}>
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
          <LogoutButtonContainer />

          <CloudUploadIcon
            style={{ color: '#BB86FC', 'margin-right': '10px' }}
          />
          <SearchIcon onClick={showSearchPanel} />
        </Toolbar>
      </AppBar>
    </TopBarWrapper>
  );
}
