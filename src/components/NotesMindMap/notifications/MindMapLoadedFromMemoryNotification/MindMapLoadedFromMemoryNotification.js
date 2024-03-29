import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'colors';
import { saveDontShowAgain, getDontShowAgain } from './dontShowAgainStorage';
import { mindMapLoadedFromMemorySelector } from 'components/NotesMindMap/NotesMindMapSelectors';
import { wasNotificationClosedSelector } from './MindMapLoadedFromMemoryNotificationSelectors';
import { mindMapLoadedFromMemoryNotificationClosed } from './MindMapLoadedFromMemoryNotificationActions';
import NotesMindMapSnackbar from 'components/NotesMindMap/NotesMindMapSnackbar';

const useStyles = makeStyles(theme => ({
  actions: {
    '& > * + *': {
      marginLeft: theme.spacing(1),
    },
  },
}));

export const MindMapLoadedFromMemoryNotification = () => {
  const dispatch = useDispatch();
  const mindMapLoadedFromMemory = useSelector(mindMapLoadedFromMemorySelector);
  const wasNotificationClosed = useSelector(wasNotificationClosedSelector);
  const classes = useStyles();

  const message =
    'Mind map was loaded from device memory. If you made changes on another device, notes will be refreshed as you click on them.';

  const handleClose = () => {
    dispatch(mindMapLoadedFromMemoryNotificationClosed());
  };

  const handleDontShowAgainClick = () => {
    saveDontShowAgain();
    handleClose();
  };

  const actions = (
    <div className={classes.actions}>
      <Button
        style={{ color: colors.onPrimaryHighEmphasis }}
        size="medium"
        onClick={handleDontShowAgainClick}>
        Don&apos;t show again
      </Button>
      <Button color="secondary" size="medium" onClick={handleClose}>
        OK
      </Button>
    </div>
  );

  const isOpen =
    mindMapLoadedFromMemory && !wasNotificationClosed && !getDontShowAgain();

  return (
    <NotesMindMapSnackbar open={isOpen} message={message} action={actions} />
  );
};

export default MindMapLoadedFromMemoryNotification;
