import React from 'react';

import { Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { OpenFileButtonContainer } from 'components/OpenFileButton/OpenFileButtonContainer';
import { UploadButton } from 'components/Uploads/UploadButton';
import { colors } from 'colors';
import { BottomBarMenu } from './BottomBarMenu';
import { NoteDeletedNotification } from './NoteDeletedNotification';
import noteStorage from 'storage/noteStorage';

import {
  editNoteButtonClickedAction,
  addNoteButtonClickedAction,
} from './BottomBarActions';

const useStyles = makeStyles(() => ({
  toolbar: {
    // FAB width + FAB right margin + padding for text
    paddingRight: 'calc(56px + 12px + 12px)',
  },
  editButton: {
    color: colors.onSurfaceMediumEmphasis,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    right: 12,
  },
  appBar: {
    backgroundColor: colors.elevationOverlay04dp,
  },
  noteName: {
    paddingLeft: '6px',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
}));

export const BottomBar = () => {
  const classes = useStyles();

  const selectedNote = useSelector(state => state.notesMindMap.selectedNote);
  const dispatch = useDispatch();

  const handleEditButtonClick = () => {
    dispatch(editNoteButtonClickedAction(selectedNote));
  };

  const handleAddButtonClick = () => {
    dispatch(addNoteButtonClickedAction(selectedNote));
  };

  const isAppFolder = noteStorage.isAppFolder(selectedNote);

  const EditNoteButton = () => (
    <IconButton
      aria-label="edit"
      onClick={handleEditButtonClick}
      className={classes.editButton}>
      <EditIcon />
    </IconButton>
  );

  const AddNoteButton = () => (
    <Fab
      aria-label="add"
      className={classes.fabButton}
      color="primary"
      onClick={handleAddButtonClick}>
      <AddIcon />
    </Fab>
  );

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar classes={{ root: classes.toolbar }}>
          <BottomBarMenu />
          {!selectedNote.isUploadedFile && !isAppFolder && <EditNoteButton />}
          <Typography className={classes.noteName} variant="subtitle2">
            {selectedNote.name}
          </Typography>
          {!selectedNote.isUploadedFile && <AddNoteButton />}
          {!selectedNote.isUploadedFile && <UploadButton />}
          {selectedNote.isUploadedFile && <OpenFileButtonContainer />}
        </Toolbar>
      </AppBar>
      <NoteDeletedNotification />
    </>
  );
};
