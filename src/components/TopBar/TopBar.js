import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import styled from 'styled-components';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const TopBarWrapper = styled.div`
  display: flex;
`;

const useStyles = makeStyles(theme => ({
  emptyAppbarPalceholder: {
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

export const TopBar = ({ children }) => {
  const theme = useTheme();
  const classes = useStyles();
  console.log('theme', theme);
  return (
    <>
      <TopBarWrapper>
        <AppBar>
          <Toolbar>{children}</Toolbar>
        </AppBar>
      </TopBarWrapper>
      <div className={classes.emptyAppbarPalceholder} />
    </>
  );
};
