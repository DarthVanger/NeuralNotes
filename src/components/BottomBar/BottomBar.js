import React from 'react';

import { Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import LaunchOutlinedIcon from '@material-ui/icons/LaunchOutlined';
import styled from 'styled-components';
import { UploadButton } from 'components/Uploads/UploadButton';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(() => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    right: 12,
  },
}));

const StyledLabel = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
`;

export const BottomBar = () => {
  const classes = useStyles();

  const selectedNote = useSelector(state => state.notesMindMap.selectedNote);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          style={{ color: '#dadada' }}
          aria-label="open drawer">
          <LaunchOutlinedIcon />
        </IconButton>
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

        <div className={classes.grow} />
      </Toolbar>
    </AppBar>
  );
};
