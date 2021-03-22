import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { TopBar } from 'components/TopBar/TopBar';
import { TopBarLeftButtons } from 'components/TopBar/TopBarLeftButtons';
import { TopBarPageTitle } from 'components/TopBar/TopBarPageTitle';
import { TopBarRightButtons } from 'components/TopBar/TopBarRightButtons';

import { LogoutButtonContainer } from 'components/LogoutButton/LogoutButtonContainer';

import * as Selectors from 'components/Uploads/UploadsSelectors';

export const NotesPageTopBar = () => {
  const hasUploads = useSelector(Selectors.hasUploads);
  // const hasActiveUploads = useSelector(Selectors.hasActiveUploads);

  return (
    <TopBar>
      <TopBarLeftButtons>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
      </TopBarLeftButtons>
      <TopBarPageTitle style={{ color: '#BB86FC' }}>
        Neural Notes
      </TopBarPageTitle>
      <TopBarRightButtons>
        <LogoutButtonContainer />
        {hasUploads && (
          <Link to="/uploads">
            <IconButton>
              <CloudUploadIcon
                style={{ color: '#BB86FC', marginRight: '10px' }}
              />
            </IconButton>
          </Link>
        )}
        <Link to="search">
          <IconButton>
            <SearchIcon style={{ color: '#BB86FC' }} />
          </IconButton>
        </Link>
      </TopBarRightButtons>
    </TopBar>
  );
};
