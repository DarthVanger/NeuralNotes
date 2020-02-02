import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AttachmentsEmptyList = () => {
  return <StyledContainer>No uploads</StyledContainer>;
};

export { AttachmentsEmptyList };
