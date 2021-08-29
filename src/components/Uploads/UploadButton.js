import React from 'react';

import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import { useDispatch, useSelector } from 'react-redux';
import { NotesMindMapSelectors } from 'selectors';

import { UploadsActions } from './UploadsActions';

const useStyles = makeStyles(() => ({
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -98,
    right: 12,
  },
}));

export function UploadButton() {
  function onUploadButtonClick() {
    fileInputRef.current.click();
  }

  function handleSelectedFiles(event) {
    if (event.target.files.length > 0) {
      dispatch(
        UploadsActions.list.addedFiles(event.target.files, uploadFolderId),
      );
      fileInputRef.current.value = null;
    }
  }
  const classes = useStyles();
  const dispatch = useDispatch();
  const uploadFolderId = useSelector(NotesMindMapSelectors.getSelectedNoteId);
  const fileInputRef = React.createRef();

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleSelectedFiles}
      />
      <Fab
        aria-label="upload"
        onClick={onUploadButtonClick}
        className={classes.fabButton}>
        <PublishIcon />
      </Fab>
    </>
  );
}
