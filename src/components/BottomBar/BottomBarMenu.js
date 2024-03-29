import React, { useRef, useState } from 'react';

import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useSelector, useDispatch } from 'react-redux';
import Link from '@material-ui/core/Link';
import { colors } from 'colors';
import noteStorage from 'storage/noteStorage';

import {
  editNoteButtonClickedAction,
  changeParentButtonClickedAction,
} from './BottomBarActions';
import DialogDeleteNote from 'components/Modal/DialogDeleteNote';

const useStyles = makeStyles(() => ({
  moreIcon: {
    color: colors.onSurfaceMediumEmphasis,
  },
}));

export const BottomBarMenu = () => {
  const classes = useStyles();
  // menuAnchorEl is used to be a relative point for menu position
  const menuAnchorEl = useRef();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const selectedNote = useSelector(state => state.notesMindMap.selectedNote);
  const dispatch = useDispatch();

  const openMenu = () => setIsMenuOpened(true);
  const closeMenu = () => setIsMenuOpened(false);

  const handleEditButtonClick = () => {
    dispatch(editNoteButtonClickedAction(selectedNote));
  };

  const handleChangeParentButtonClick = () => {
    dispatch(changeParentButtonClickedAction(selectedNote));
  };
  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);

  const editMenuItem = (
    <MenuItem onClick={handleEditButtonClick}>
      <Typography variant="subtitle1">Edit</Typography>
    </MenuItem>
  );

  const changeParentMenuItem = (
    <MenuItem onClick={handleChangeParentButtonClick}>
      <Typography variant="subtitle1">Change parent</Typography>
    </MenuItem>
  );

  const deleteNoteMenuItem = (
    <MenuItem
      onClick={() => {
        openDeleteDialog();
        closeMenu();
      }}>
      <Typography variant="subtitle1">Delete</Typography>
    </MenuItem>
  );

  const openInGoogleDriveMenuItem = (
    <MenuItem
      component={Link}
      href={noteStorage.getLinkToNote(selectedNote)}
      target="_blank"
      onClick={closeMenu}>
      Open in Google Drive
    </MenuItem>
  );

  const isAppFolder = noteStorage.isAppFolder(selectedNote);

  return (
    <>
      <IconButton
        ref={menuAnchorEl}
        className={classes.moreIcon}
        edge="start"
        aria-label="more"
        aria-haspopup="true"
        onClick={openMenu}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        anchorEl={menuAnchorEl.current}
        keepMounted
        open={isMenuOpened}
        onClose={closeMenu}>
        {!selectedNote.isUploadedFile && !isAppFolder && editMenuItem}
        {!isAppFolder && changeParentMenuItem}
        {!isAppFolder && deleteNoteMenuItem}
        {openInGoogleDriveMenuItem}
      </Menu>
      <DialogDeleteNote
        isDeleteDialogOpen={isDeleteDialogOpen}
        closeDeleteDialog={closeDeleteDialog}
      />
    </>
  );
};
