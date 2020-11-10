import React from 'react';

import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UploadsListEmpty = () => {
  return (
    <StyledContainer>
      <Typography variant="subtitle1">No uploads</Typography>
    </StyledContainer>
  );
};

export { UploadsListEmpty };
