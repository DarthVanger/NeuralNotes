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

import {
  editNoteButtonClickedAction,
  addNoteButtonClickedAction,
} from './BottomBarActions';

const useStyles = makeStyles(() => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  left: {
    position: 'absolute',
    color: colors.textColor,
    left: '46px',
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    right: 12,
  },
}));

const StyledLabel = styled.div`
  width: 100%;
  text-align: center;
`;

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

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <BottomBarMenu />
        {!selectedNote.isUploadedFile && (
          <>
            <IconButton
              aria-label="edit"
              onClick={handleEditButtonClick}
              className={classes.left}>
              <EditIcon />
            </IconButton>
          </>
        )}
        <StyledLabel>
          <Typography variant="subtitle2">{selectedNote.name}</Typography>
        </StyledLabel>

        {!selectedNote.isUploadedFile && (
          <>
            <Fab
              aria-label="add"
              className={classes.fabButton}
              color="primary"
              onClick={handleAddButtonClick}>
              <AddIcon />
            </Fab>
            <UploadButton></UploadButton>
          </>
        )}
        {selectedNote.isUploadedFile && <OpenFileButtonContainer />}
      </Toolbar>
    </AppBar>
  );
};
