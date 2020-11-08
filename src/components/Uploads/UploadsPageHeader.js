import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// import * as AppActions from 'components/App/AppActions';
// import * as AppConstants from 'components/App/AppConstants';
import { UploadsActions } from './UploadsActions';
import * as Selectors from './UploadsSelectors';

const StyledPageHeaderContainer = styled.div`
  background-color: #1a1a1a;
`;

const StyledBackButton = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  outline: none;
  background: none;
`;

const UploadsPageHeader = () => {
  const dispatch = useDispatch();
  const hasActiveUploads = useSelector(Selectors.hasActiveUploads);
  let history = useHistory();

  function handleBackClick() {
    history.push('/notes');

    if (!hasActiveUploads) {
      dispatch(UploadsActions.list.clear());
    }
  }

  return (
    <StyledPageHeaderContainer>
      <StyledBackButton onClick={handleBackClick}>&#10502;</StyledBackButton>
    </StyledPageHeaderContainer>
  );
};

export { UploadsPageHeader };
