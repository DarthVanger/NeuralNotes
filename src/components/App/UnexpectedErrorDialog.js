import React from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { unexpectedErrorSelector } from './AppSelectors';
import { clearNotesMindMapLocalStorage } from 'storage/notesMindMapLocalStorage';
import { logout } from 'auth';

const UnexpectedErrorDialog = () => {
  const unexpectedError = useSelector(unexpectedErrorSelector);

  const handleRestartAppClick = () => {
    clearNotesMindMapLocalStorage();
    logout();
  };

  return (
    <Dialog
      open={Boolean(unexpectedError)}
      aria-labelledby="unexpected-error-dialog-title"
      aria-describedby="unexpected-error-dialog-description">
      <DialogTitle id="unexpected-error-dialog-title">
        Unexpected error
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="unexpected-error-dialog-description">
          The app crashed due to an unexpected error! <br />
          Please report the problem or just restart the app. <br />
          <code>Error: {unexpectedError?.message}</code>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRestartAppClick} color="primary">
          Restart app
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnexpectedErrorDialog;
