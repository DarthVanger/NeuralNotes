import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { colors } from '../../colors';

export function NotesPageTopBarMenu({ logout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuIconClick = event => {
    setIsMenuOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleMenuIconClick}
        edge="start"
        aria-label="menu"
        aria-controls="burger-menu">
        <MenuIcon style={{ color: colors.white87 }} />
      </IconButton>
      <Menu
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: `left` }}
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            width: '128px',
          },
        }}>
        <MenuItem onClick={logout}>
          <Typography variant="subtitle1">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
