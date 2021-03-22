import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import styled from 'styled-components';

const TopBarWrapper = styled.div`
  display: flex;
  height: 5rem;
`;

export const TopBar = ({ children }) => {
  return (
    <TopBarWrapper>
      <AppBar style={{ background: '#272727' }}>
        <Toolbar>{children}</Toolbar>
      </AppBar>
    </TopBarWrapper>
  );
};
