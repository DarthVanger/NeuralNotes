import React from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

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
