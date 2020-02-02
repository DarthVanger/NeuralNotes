import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import * as AppActions from 'components/App/AppActions';
import * as AppConstants from 'components/App/AppConstants';
import * as Selectors from './UploadsSelectors';

const StyledStatusButton = styled.button`
  position: absolute;
  right: 5px;
  bottom: 50px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #2c7be0;
  border: none;
  outline: none;

  &.processing {
    animation: pulse 3s infinite;
  }

  &.enter {
    opacity: 0;
  }

  &.enter-active {
    opacity: 1;
    transition: opacity 200ms;
  }

  &.exit {
    opacity: 1;
  }

  &.exit-active {
    opacity: 0;
    transition: opacity 200ms;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

/**
 * @todo: we need to do this component more information
 * it should represent uploading status state:
 * - when success
 * - when partial success
 * - when has errors
 */
const StatusButtonComponent = () => {
  const dispatch = useDispatch();
  const hasUploads = useSelector(Selectors.hasUploads);
  const hasActiveUploads = useSelector(Selectors.hasActiveUploads);

  function onButtonClick() {
    dispatch({
      type: AppActions.CHANGE_PAGE_ACTION,
      data: AppConstants.PAGES_ENUM.ATTACHMENTS,
    });
  }

  return (
    <CSSTransition in={hasUploads} timeout={200} unmountOnExit>
      <StyledStatusButton
        className={`btn btn-default ${hasActiveUploads ? 'processing' : ''}`}
        onClick={onButtonClick}>
        <FontAwesomeIcon icon={faArrowUp} />
      </StyledStatusButton>
    </CSSTransition>
  );
};

export { StatusButtonComponent };
