import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';

import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { colors } from '../../colors';

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

  const openMenu = () => setIsMenuOpened(true);
  const closeMenu = () => setIsMenuOpened(false);

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
          <Link to="/note" style={{ textDecoration: 'none' }}>
            <MenuItem>
              <Typography variant="subtitle1">Edit</Typography>
            </MenuItem>
          </Link>
        )}
        <MenuItem>
          <Typography variant="subtitle1">Change parent</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle1">Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
