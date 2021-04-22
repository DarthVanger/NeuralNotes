import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SearchIcon from '@material-ui/icons/Search';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { TopBar } from 'components/TopBar/TopBar';
import { TopBarLeftButtons } from 'components/TopBar/TopBarLeftButtons';
import { TopBarPageTitle } from 'components/TopBar/TopBarPageTitle';
import { TopBarRightButtons } from 'components/TopBar/TopBarRightButtons';

import { NotesPageTopBarMenu } from './NotesPageTopBarMenu';

import * as Selectors from 'components/Uploads/UploadsSelectors';

import { colors } from 'colors';

export const NotesPageTopBar = () => {
  const hasUploads = useSelector(Selectors.hasUploads);
  // const hasActiveUploads = useSelector(Selectors.hasActiveUploads);

  return (
    <TopBar>
      <TopBarLeftButtons>
        <NotesPageTopBarMenu />
      </TopBarLeftButtons>
      <TopBarPageTitle style={{ color: colors.primaryColor }}>
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
            <SearchIcon style={{ color: colors.textColor }} />
          </IconButton>
        </Link>
      </TopBarRightButtons>
    </TopBar>
  );
};
