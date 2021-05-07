import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { deleteNoteAction } from '../../components/BottomBar/BottomBarActions';

const DialogDeleteNote = ({ closeDeleteDialog, isDeleteDialogOpen }) => {
  const selectedNote = useSelector(state => state.notesMindMap.selectedNote);
  const dispatch = useDispatch();
  const confirmDeleteNote = () => {
    dispatch(deleteNoteAction(selectedNote));
    closeDeleteDialog();
  };
  return (
    <Dialog
      open={isDeleteDialogOpen}
      onClose={closeDeleteDialog}
      aria-labelledby="delete-note-confirmation-dialog-title">
      <DialogTitle id="delete-note-confirmation-dialog-title">
        Delete {selectedNote.name}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-note-confirmation-dialog-description">
          Are you sure you want to delete this note?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={confirmDeleteNote} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDeleteNote;
