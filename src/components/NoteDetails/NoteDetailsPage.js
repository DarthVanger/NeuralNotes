import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from 'colors';
import { history } from '../../sagas';

import { NoteDetailsContainer } from 'components/NoteDetails/NoteDetailsContainer';
import {
  AppBar,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useRef } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeParentButtonClickedAction,
  deleteNoteAction,
} from 'components/BottomBar/BottomBarActions';

const Wrapper = styled.div`
  background-color: ${colors.darkViolet};
`;

const BackButtonWrapper = styled.div`
  padding: 0.5rem;
`;

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

export const NoteDetailsPage = () => {
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
    history.push('/notes');
  };

  return (
    <Wrapper>
      <AppBar position="relative" className={classes.appBar}>
        <Toolbar>
          <BackButtonWrapper>
            <Link to="/notes">
              <IconButton aria-label="back">
                <ArrowBackIcon style={{ fill: colors.white60 }} />
              </IconButton>
            </Link>
          </BackButtonWrapper>
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
            {/* {!selectedNote.isUploadedFile && (
              <MenuItem onClick={handleEditButtonClick}>
                <Typography variant="subtitle1">Edit</Typography>
              </MenuItem>
            )} */}
            <MenuItem onClick={handleChangeParentButtonClick}>
              <Typography variant="subtitle1">Change parent</Typography>
            </MenuItem>
            <MenuItem onClick={handleDeleteButtonClick}>
              <Typography variant="subtitle1">Delete</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <NoteDetailsContainer />
    </Wrapper>
  );
};
