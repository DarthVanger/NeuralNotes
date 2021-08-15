import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

import { NotesMindMapContainer } from 'components/NotesMindMap/NotesMindMapContainer';
import { TopBar } from 'components/TopBar/TopBar';
import { TopBarLeftButtons } from 'components/TopBar/TopBarLeftButtons';
import { TopBarPageTitle } from 'components/TopBar/TopBarPageTitle';
import { BackButton } from 'components/BackButton/BackButton';
import { getSelectedNote } from 'components/NotesMindMap/NotesMindMapSelectors';
import { colors } from 'colors';
import { changeNoteParentPageMountedAction } from './ChangeNoteParentPageActions';

export const ChangeNoteParentPage = () => {
  const dispatch = useDispatch();
  const selectedNote = useSelector(getSelectedNote);

  useEffect(() => {
    dispatch(changeNoteParentPageMountedAction());
  }, []);

  return (
    <>
      <TopBar>
        <TopBarLeftButtons>
          <BackButton to="/notes" />
        </TopBarLeftButtons>
        <TopBarPageTitle>Choose a new parent</TopBarPageTitle>
      </TopBar>
      <NotesMindMapContainer />
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="body2"
            style={{ color: colors.onPrimaryHighEmphasis }}>
            Click on a note to move "{selectedNote.name}" under it
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};
