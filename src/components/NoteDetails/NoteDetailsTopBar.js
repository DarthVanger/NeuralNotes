import React from 'react';
import {
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { TopBar } from 'components/TopBar/TopBar';
import { TopBarLeftButtons } from 'components/TopBar/TopBarLeftButtons';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import { TopBarPageTitle } from 'components/TopBar/TopBarPageTitle';
import { colors } from 'colors';
import { Link } from 'react-router-dom';
import {
  changeParentButtonClickedAction,
  deleteNoteAction,
} from 'components/BottomBar/BottomBarActions';

const useStyles = makeStyles(() => ({
  appBar: {
    top: 0,
  },
  moreIcon: {
    position: 'absolute',
    color: colors.iconColor,
    right: 0,
    padding: '12px',
    marginRight: '40px',
  },
}));

const NoteDetailsTopBar = props => {
  const classes = useStyles();
  const menuAnchorEl = useRef();
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const selectedNote = useSelector(state => state.notesMindMap.selectedNote);

  const dispatch = useDispatch();

  const openMenu = () => setIsMenuOpened(true);
  const closeMenu = () => setIsMenuOpened(false);

  const handleChangeParentButtonClick = () => {
    dispatch(changeParentButtonClickedAction(selectedNote));
  };

  const handleDeleteButtonClick = () => {
    dispatch(deleteNoteAction(selectedNote));
  };
  const title = selectedNote ? selectedNote.name : 'Add you note';

  return (
    <TopBar>
      <TopBarLeftButtons>
        <Link to="/notes">
          <IconButton aria-label="back">
            <ArrowBackIcon style={{ fill: colors.white60 }} />
          </IconButton>
        </Link>
      </TopBarLeftButtons>
      <TopBarPageTitle>{title}</TopBarPageTitle>
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
        PaperProps={{
          style: {
            width: '168px',
          },
        }}>
        <MenuItem onClick={handleChangeParentButtonClick}>
          <Typography variant="subtitle1">Change parent</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteButtonClick}>
          <Typography variant="subtitle1">Delete</Typography>
        </MenuItem>
      </Menu>
    </TopBar>
  );
};

export default NoteDetailsTopBar;
