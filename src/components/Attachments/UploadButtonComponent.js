import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import * as Actions from './AttachmentsActions';
import * as Selectors from './AttachmentsSelectors';

const StyledUploadButton = styled.button`
  position: absolute;
  right: 5px;
  bottom: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #46d1df;
  border: none;
  outline: none;

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
`;

const UploadButtonComponent = () => {
  const dispatch = useDispatch();
  const isUploadButtonVisible = useSelector(Selectors.isUploadButtonVisible);
  const uploadFolderId = useSelector(Selectors.getUploadFolderId);
  const alreadyUploadingFiles = useSelector(Selectors.getUploadFiles);
  const fileInputRef = React.createRef();

  function onUploadButtonClick() {
    fileInputRef.current.click();
  }

  function handleSelectedFiles(event) {
    if (event.target.files.length > 0) {
      const files = Array.from(event.target.files).filter(
        item => !alreadyUploadingFiles.includes(item),
      );
      dispatch(Actions.addUploadingFiles(files, uploadFolderId));
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleSelectedFiles}
      />
      <CSSTransition in={isUploadButtonVisible} timeout={200} unmountOnExit>
        <StyledUploadButton
          className="btn btn-default"
          onClick={onUploadButtonClick}>
          <FontAwesomeIcon icon={faPlus} />
        </StyledUploadButton>
      </CSSTransition>
    </>
  );
};

export { UploadButtonComponent };
