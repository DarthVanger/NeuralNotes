import React, { useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { TopBar } from 'components/TopBar/TopBar';
import { TopBarLeftButtons } from 'components/TopBar/TopBarLeftButtons';
import { TopBarPageTitle } from 'components/TopBar/TopBarPageTitle';
import { TopBarRightButtons } from 'components/TopBar/TopBarRightButtons';

import { LogoutButtonContainer } from 'components/LogoutButton/LogoutButtonContainer';

import * as Selectors from 'components/Uploads/UploadsSelectors';

import { colors } from 'colors';

export const NotesPageTopBar = () => {
  const hasUploads = useSelector(Selectors.hasUploads);
  // const hasActiveUploads = useSelector(Selectors.hasActiveUploads);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
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
    <TopBar>
      <TopBarLeftButtons>
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
          onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>
            <LogoutButtonContainer />
          </MenuItem>
        </Menu>
      </TopBarLeftButtons>
      <TopBarPageTitle style={{ color: colors.violet }}>
        Neural Notes
      </TopBarPageTitle>
      <TopBarRightButtons>
        {hasUploads && (
          <Link to="/uploads">
            <IconButton>
              <CloudUploadIcon
                color="primary"
                style={{ marginRight: '10px' }}
              />
            </IconButton>
          </Link>
        )}
        <Link to="search">
          <IconButton>
            <SearchIcon style={{ color: colors.white60 }} />
          </IconButton>
        </Link>
      </TopBarRightButtons>
    </TopBar>
  );
};
