import React from 'react';

import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { colors } from 'colors';

import { UploadsList } from './UploadsList';
import { UploadsPageTopBar } from './UploadsPageTopBar';
import * as Selectors from './UploadsSelectors';

const StyledPageContainer = styled.div`
  background: ${colors.elevationOverlay02dp};
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const UploadsPage = () => {
  const list = useSelector(Selectors.getUploadsList);

  return (
    <StyledPageContainer>
      <UploadsPageTopBar />
      <UploadsList list={list} />
    </StyledPageContainer>
  );
};

export { UploadsPage };
