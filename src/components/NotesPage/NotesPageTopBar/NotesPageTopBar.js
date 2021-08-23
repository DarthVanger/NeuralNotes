import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SearchIcon from '@material-ui/icons/Search';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

import { TopBar } from 'components/TopBar/TopBar';
import { TopBarLeftButtons } from 'components/TopBar/TopBarLeftButtons';
import { TopBarRightButtons } from 'components/TopBar/TopBarRightButtons';
import { NotesPageTopBarMenu } from './NotesPageTopBarMenu';
import * as Selectors from 'components/Uploads/UploadsSelectors';
import { colors } from 'colors';
import { resetMindMapToRootNode } from 'components/NotesMindMap/NotesMindMapActions';
import { makeStyles } from '@material-ui/core/styles';
import SavingStatus from './SavingStatus';

const useStyles = makeStyles({
  middleBlock: {
    flexGrow: 1,
  },
  title: {
    color: colors.primary,
    cursor: 'pointer',
    display: 'inline-block',
  },
});

export const NotesPageTopBar = () => {
  const hasUploads = useSelector(Selectors.hasUploads);
  const dispatch = useDispatch();
  // const hasActiveUploads = useSelector(Selectors.hasActiveUploads);
  //
  const handleAppTitleClick = () => {
    dispatch(resetMindMapToRootNode());
  };

  const classes = useStyles();

  return (
    <TopBar>
      <TopBarLeftButtons>
        <NotesPageTopBarMenu />
      </TopBarLeftButtons>
      <div className={classes.middleBlock}>
        <Typography
          variant="h6"
          className={classes.title}
          onClick={handleAppTitleClick}>
          Neural Notes
        </Typography>
        <SavingStatus />
      </div>
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
            <SearchIcon style={{ color: colors.onSurfaceMediumEmphasis }} />
          </IconButton>
        </Link>
      </TopBarRightButtons>
    </TopBar>
  );
};
