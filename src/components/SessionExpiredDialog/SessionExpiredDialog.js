import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { sessionExpiredSelector } from './SessionExpiredDialogSelectors';
import { refreshSessionButtonClickedAction } from './SessionExpiredDialogActions';

const SessionExpiredDialog = () => {
  const dispatch = useDispatch();
  const sessionExpired = useSelector(sessionExpiredSelector);

  const isOpen = sessionExpired;

  const handleLoginClick = () => {
    dispatch(refreshSessionButtonClickedAction());
  };

  return (
    <Dialog
      open={isOpen}
      aria-labelledby="session-expired-dialog-title"
      aria-describedby="session-expired-dialog-description">
      <DialogTitle id="session-expired-dialog-title">
        Session Expired
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="session-expired-dialog-description">
          Click the refresh button below to continue using the app
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLoginClick} color="primary">
          Refresh session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiredDialog;
