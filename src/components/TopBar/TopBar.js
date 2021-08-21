import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'colors';

const TopBarWrapper = styled.div`
  display: flex;
`;

const useStyles = makeStyles(theme => ({
  emptyAppbarPalceholder: {
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: colors.elevationOverlay04dp,
  },
}));

export const TopBar = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <TopBarWrapper>
        <AppBar className={classes.appBar}>
          <Toolbar>{children}</Toolbar>
        </AppBar>
      </TopBarWrapper>
      <div className={classes.emptyAppbarPalceholder} />
    </>
  );
};
