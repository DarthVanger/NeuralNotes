import React from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import * as Selectors from './AttachmentsSelectors';

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
  const isStatusButtonVisible = useSelector(Selectors.hasUploadingFiles);
  const isUploadingProcessing = useSelector(Selectors.isUploadingProcessing);

  return (
    <CSSTransition in={isStatusButtonVisible} timeout={200} unmountOnExit>
      <StyledStatusButton
        className={`btn btn-default ${
          isUploadingProcessing ? 'processing' : ''
        }`}>
        <FontAwesomeIcon icon={faArrowUp} />
      </StyledStatusButton>
    </CSSTransition>
  );
};

export { StatusButtonComponent };
