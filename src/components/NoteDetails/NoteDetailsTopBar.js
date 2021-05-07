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
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import { TopBarPageTitle } from 'components/TopBar/TopBarPageTitle';
import { changeParentButtonClickedAction } from 'components/BottomBar/BottomBarActions';
import { colors } from 'colors';
import { BackButton } from 'components/BackButton/BackButton';
import { TopBarRightButtons } from 'components/TopBar/TopBarRightButtons';
import DialogDeleteNote from 'components/Modal/DialogDeleteNote';

const useStyles = makeStyles(() => ({
  moreIcon: {
    color: colors.textColor,
  },
}));

const NoteDetailsTopBar = () => {
  const classes = useStyles();
  const menuAnchorEl = useRef();

  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const selectedNote = useSelector(state => state.notesMindMap.selectedNote);
  const dispatch = useDispatch();

  const openMenu = () => setIsMenuOpened(true);
  const closeMenu = () => setIsMenuOpened(false);

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);

  const handleChangeParentButtonClick = () => {
    dispatch(changeParentButtonClickedAction(selectedNote));
  };
  return (
    <TopBar>
      <TopBarLeftButtons>
        <BackButton to="/notes" />
      </TopBarLeftButtons>
      <TopBarPageTitle>{selectedNote.name}</TopBarPageTitle>
      <TopBarRightButtons>
        <IconButton
          ref={menuAnchorEl}
          className={classes.moreIcon}
          aria-label="more"
          aria-haspopup="true"
          onClick={openMenu}>
          <MoreVertIcon />
        </IconButton>
      </TopBarRightButtons>
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
        <MenuItem onClick={closeMenu}>
          <Typography variant="subtitle1" onClick={openDeleteDialog}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>
      <DialogDeleteNote
        isDeleteDialogOpen={isDeleteDialogOpen}
        closeDeleteDialog={closeDeleteDialog}
      />
    </TopBar>
  );
};

export default NoteDetailsTopBar;
