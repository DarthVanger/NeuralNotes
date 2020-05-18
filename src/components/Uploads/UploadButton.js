import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { NotesMindMapSelectors } from 'selectors';
import { UploadsActions } from './UploadsActions';

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

const UploadButton = () => {
  const dispatch = useDispatch();
  const isUploadButtonVisible = useSelector(
    NotesMindMapSelectors.isSelectedNoteRealNote,
  );
  const uploadFolderId = useSelector(NotesMindMapSelectors.getSelectedNoteId);
  const fileInputRef = React.createRef();

  function onUploadButtonClick() {
    fileInputRef.current.click();
  }

  function handleSelectedFiles(event) {
    if (event.target.files.length > 0) {
      const files = Array.from(event.target.files);

      files.forEach(item => {
        item.uploadFolderId = uploadFolderId;
        item.abortController = new window.AbortController();
      });

      dispatch(UploadsActions.list.addedFiles(files));
      fileInputRef.current.value = null;
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
          &#10010;
        </StyledUploadButton>
      </CSSTransition>
    </>
  );
};

export { UploadButton };
