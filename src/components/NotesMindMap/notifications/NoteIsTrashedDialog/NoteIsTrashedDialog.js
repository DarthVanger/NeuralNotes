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

import { showDialogSelector } from './NoteIsTrashedDialogSelectors';
import { dismissNoteIsTrashedDialogAction } from './NoteIsTrashedDialogActions';

const NoteIsTrashedDialog = () => {
  const dispatch = useDispatch();
  const showDialog = useSelector(showDialogSelector);
  const selectedNote = useSelectedNote();
  const graph = useGraph();

  const handleDismissClick = () => {
    dispatch(dismissNoteIsTrashedDialogAction({ graph }));
  };

  return (
    <Dialog
      open={showDialog}
      aria-labelledby="note-is-trashed-dialog-title"
      aria-describedby="note-is-trashed-dialog-description">
      <DialogTitle id="note-is-trashed-dialog-title">
        Selected note is in trash
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="note-is-trashed-dialog-description">
          The selected note &quot;{selectedNote.name}&quot; was moved to trash
          from another device.
          <br />
          You can restore it from Google Drive Trash.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          size="medium"
          href="https://drive.google.com/drive/trash"
          target="_blank">
          Open Trash
        </Button>
        <Button onClick={handleDismissClick} color="primary">
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteIsTrashedDialog;
