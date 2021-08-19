import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NotesMindMapSnackbar from 'components/NotesMindMap/NotesMindMapSnackbar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'colors';
import { noteDeletedNotificationClosedAction } from './BottomBarActions';
import { showNoteDeletedNotificationSelector } from './BottomBarSelectors';

const useStyles = makeStyles(theme => ({
  actions: {
    '& > * + *': {
      marginLeft: theme.spacing(1),
    },
  },
}));

export const NoteDeletedNotification = () => {
  const dispatch = useDispatch();
  const showNoteDeletedNotification = useSelector(
    showNoteDeletedNotificationSelector,
  );
  const classes = useStyles();

  const message = 'Note deleted. You can restore it from Google Drive Trash.';

  const handleClose = () => {
    dispatch(noteDeletedNotificationClosedAction());
  };

  const actions = (
    <div className={classes.actions}>
      <Button
        color="secondary"
        size="medium"
        href="https://drive.google.com/drive/trash"
        target="_blank">
        Open Trash
      </Button>
      <Button
        color="secondary"
        size="medium"
        onClick={handleClose}
        style={{ color: colors.onPrimaryHighEmphasis }}>
        OK
      </Button>
    </div>
  );

  return (
    <NotesMindMapSnackbar
      autoHideDuration={6000}
      open={showNoteDeletedNotification}
      onClose={handleClose}
      message={message}
      action={actions}
    />
  );
};

export default NoteDeletedNotification;
