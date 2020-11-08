import React from 'react';

import { Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { UploadButton } from 'components/Uploads/UploadButton';

import { colors } from '../../colors';

const useStyles = makeStyles(() => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  left: {
    position: 'absolute',
    color: colors.iconColor,
    marginLeft: '30px',
  },
  moreIcon: {
    position: 'absolute',
    color: colors.iconColor,
    padding: 0,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    right: 12,
  },
}));

const StyledLabel = styled.div`
  width: 100%;
  text-align: center;
`;

const options = ['Edit', 'Cange parent', 'Delete'];

const ITEM_HEIGHT = 38;

export const BottomBar = () => {
  const classes = useStyles();

  const selectedNote = useSelector(state => state.notesMindMap.selectedNote);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const getMenuItems = () => {
    if (!selectedNote.isNote) {
      return options.slice(1);
    }

    return options;
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          className={classes.moreIcon}
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '168px',
            },
          }}>
          {getMenuItems().map(option => (
            <MenuItem
              key={option}
              selected={option === 'Edit'}
              onClick={handleClose}>
              <Typography variant="subtitle1">{option}</Typography>
            </MenuItem>
          ))}
        </Menu>

        {selectedNote.isNote && (
          <>
            <Link to="/note" className={classes.left}>
              <EditIcon />
            </Link>
          </>
        )}
        <StyledLabel>
          <Typography variant="subtitle2">{selectedNote.name}</Typography>
        </StyledLabel>

        {selectedNote.isNote && (
          <>
            <Fab aria-label="add" className={classes.fabButton} color="primary">
              <AddIcon />
            </Fab>
            <UploadButton></UploadButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
