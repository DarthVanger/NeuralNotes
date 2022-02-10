import React from 'react';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AcceptTermsDialog = ({
  open,
  onClose,
  onAccept,
  openTermsOfService,
  openPrivacyPolicy,
}) => {
  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Accept terms</DialogTitle>
      <DialogContent>
        <DialogContentText>
          All notes and files are stored in your Google Drive, so Google will
          have complete access to them.
        </DialogContentText>
        <DialogContentText>
          The website uses cookies to integrate with Google Drive.
        </DialogContentText>
        <DialogContentText>
          Your email will be recorded in order to create your account.
        </DialogContentText>
        <DialogContentText>
          You are accepting the full&nbsp;
          <Link
            component="button"
            variant="subtitle1"
            onClick={openTermsOfService}>
            terms of service
          </Link>
          &nbsp; and&nbsp;
          <Link
            component="button"
            variant="subtitle1"
            onClick={openPrivacyPolicy}>
            privacy policy
          </Link>
          &nbsp; (follow the links to read them).
        </DialogContentText>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onAccept} color="primary" autoFocus>
            Accept
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptTermsDialog;
