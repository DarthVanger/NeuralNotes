import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import * as AppActions from 'components/App/AppActions';
import * as AppConstants from 'components/App/AppConstants';

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

const AttachmentsPageHeader = () => {
  const dispatch = useDispatch();

  function handleBackClick() {
    dispatch({
      type: AppActions.CHANGE_PAGE_ACTION,
      data: AppConstants.PAGES_ENUM.NOTES,
    });
  }

  return (
    <StyledPageHeaderContainer>
      <StyledBackButton onClick={handleBackClick}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </StyledBackButton>
    </StyledPageHeaderContainer>
  );
};

export { AttachmentsPageHeader };
