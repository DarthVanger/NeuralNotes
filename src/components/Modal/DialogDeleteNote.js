import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../../colors';
import { deleteNoteAction } from '../../components/BottomBar/BottomBarActions';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  dialogContent: {
    background: colors.menuBackground,
  },
  dialogContentText: {
    color: colors.textColor,
  },
  dialogAction: {
    background: colors.menuBackground,
  },
}));

const DialogDeleteNote = ({ closeDialog, isDialogOpen }) => {
  const classes = useStyles();

  const selectedNote = useSelector(state => state.notesMindMap.selectedNote);
  const dispatch = useDispatch();
  const confirmDeleteNote = () => {
    dispatch(deleteNoteAction(selectedNote));
    closeDialog();
  };
  return (
    <div>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-slide-title">
        <DialogTitle id="alert-dialog-slide-title">
          {selectedNote.name}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText
            id="alert-dialog-description"
            className={classes.dialogContentText}>
            Are you sure you want to delete this note?
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogAction}>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteNote} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogDeleteNote;
