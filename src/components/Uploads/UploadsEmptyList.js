import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UploadsEmptyList = () => {
  return <StyledContainer>No uploads</StyledContainer>;
};

export { UploadsEmptyList };
