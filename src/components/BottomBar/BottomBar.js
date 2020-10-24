import React from 'react';

import { Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import LaunchOutlinedIcon from '@material-ui/icons/LaunchOutlined';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { UploadsActions } from 'components/Uploads/UploadsActions';
import { NotesMindMapSelectors } from 'selectors';

const useStyles = makeStyles(() => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    right: 90,
  },
}));

const StyledLabel = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
`;

const UploadFileButton = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

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
      <Fab
        onClick={onUploadButtonClick}
        aria-label="add"
        className={classes.fabButton}
        color="primary">
        <AddIcon />
      </Fab>
    </>
  );
};

export const BottomBar = () => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          style={{ color: '#dadada' }}
          aria-label="open drawer">
          <LaunchOutlinedIcon />
        </IconButton>
        <StyledLabel>
          <Typography variant="subtitle2">Neural Notes</Typography>
        </StyledLabel>
        <UploadFileButton></UploadFileButton>
        <div className={classes.grow} />
      </Toolbar>
    </AppBar>
  );
};
