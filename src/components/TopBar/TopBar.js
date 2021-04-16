import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import styled from 'styled-components';
import { colors } from 'colors';

const TopBarWrapper = styled.div`
  display: flex;
  height: 5rem;
`;

export const TopBar = ({ children }) => {
  return (
    <TopBarWrapper>
      <AppBar style={{ background: colors.elevationOverlay04dp }}>
        <Toolbar>{children}</Toolbar>
      </AppBar>
    </TopBarWrapper>
  );
};
