import React from 'react';

import { Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { OpenFileButtonContainer } from 'components/OpenFileButton/OpenFileButtonContainer';
import { UploadButton } from 'components/Uploads/UploadButton';

import { colors } from '../../colors';

import { BottomBarMenu } from './BottomBarMenu';

const useStyles = makeStyles(() => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  left: {
    position: 'absolute',
    color: colors.iconColor,
    left: '46px',
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

export const BottomBar = () => {
  const classes = useStyles();

  const selectedNote = useSelector(state => state.notesMindMap.selectedNote);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <BottomBarMenu />
        {!selectedNote.isUploadedFile && (
          <>
            <Link to="/note" className={classes.left}>
              <EditIcon />
            </Link>
          </>
        )}
        <StyledLabel>
          <Typography variant="subtitle2">{selectedNote.name}</Typography>
        </StyledLabel>

        {!selectedNote.isUploadedFile && (
          <>
            <Fab aria-label="add" className={classes.fabButton} color="primary">
              <AddIcon />
            </Fab>
            <UploadButton></UploadButton>
          </>
        )}
        {selectedNote.isUploadedFile && <OpenFileButtonContainer />}
      </Toolbar>
    </AppBar>
  );
};
