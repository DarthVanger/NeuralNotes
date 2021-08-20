import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useSelectedNote from 'components/NotesMindMap/hooks/useSelectedNote';
import useGraph from 'components/NotesMindMap/hooks/useGraph';

import { showDialogSelector } from './NoteIsPermanentlyDeletedDialogSelectors';
import { noteIsPermanentlyDeletedDialogClosed } from './NoteIsPermanentlyDeletedDialogActions';

const NoteIsPermanentlyDeletedDialog = () => {
  const dispatch = useDispatch();
  const showDialog = useSelector(showDialogSelector);
  const selectedNote = useSelectedNote();
  const graph = useGraph();

  const handleOkButtonClick = () => {
    dispatch(noteIsPermanentlyDeletedDialogClosed({ graph }));
  };

  return (
    <Dialog
      open={showDialog}
      aria-labelledby="note-is-permanently-deleted-dialog-title"
      aria-describedby="note-is-permanently-deleted-dialog-description">
      <DialogTitle id="note-is-permanently-deleted-dialog-title">
        Selected note not found
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="note-is-permanently-deleted-dialog-description">
          The selected note "{selectedNote.name}" was not found on Google Drive.
          It means it was deleted more than 30 days ago from another device.
          <br />
          You can not restore this note, as Google Drive keeps trash only for 30
          days.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOkButtonClick} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteIsPermanentlyDeletedDialog;
