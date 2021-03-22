import React, { useRef, useState } from 'react';

import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useSelector, useDispatch } from 'react-redux';

import { colors } from '../../colors';

import {
  editNoteButtonClickedAction,
  changeParentButtonClickedAction,
} from './BottomBarActions';

const useStyles = makeStyles(() => ({
  moreIcon: {
    position: 'absolute',
    color: colors.iconColor,
    left: 0,
    padding: '12px',
  },
}));

export const BottomBarMenu = () => {
  const classes = useStyles();
  // menuAnchorEl is used to be a relative point for menu position
  const menuAnchorEl = useRef();
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

  return (
    <>
      <IconButton
        ref={menuAnchorEl}
        className={classes.moreIcon}
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
        onClose={closeMenu}
        aperProps={{
          style: {
            width: '168px',
          },
        }}>
        {!selectedNote.isUploadedFile && (
          <MenuItem onClick={handleEditButtonClick}>
            <Typography variant="subtitle1">Edit</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={handleChangeParentButtonClick}>
          <Typography variant="subtitle1">Change parent</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle1">Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
