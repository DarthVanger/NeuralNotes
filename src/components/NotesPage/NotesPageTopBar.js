import React from 'react';

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

const anchorPositionMenu = { top: 60, left: 0 };

export const NotesPageTopBar = () => {
  const hasUploads = useSelector(Selectors.hasUploads);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleMenuIconClick = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <TopBar>
      <TopBarLeftButtons>
        <IconButton
          onClick={handleMenuIconClick}
          edge="start"
          aria-label="menu"
          aria-controls="burger-menu">
          <MenuIcon color="primary" />
        </IconButton>
        <Menu
          anchorReference="anchorPosition"
          anchorPosition={anchorPositionMenu}
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
            <SearchIcon color="primary" />
          </IconButton>
        </Link>
      </TopBarRightButtons>
    </TopBar>
  );
};
