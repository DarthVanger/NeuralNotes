import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import styled from 'styled-components';

const TopBarWrapper = styled.div`
  display: flex;
`;

export const TopBar = ({ children }) => {
  return (
    <TopBarWrapper>
      <AppBar>
        <Toolbar>{children}</Toolbar>
      </AppBar>
    </TopBarWrapper>
  );
};
