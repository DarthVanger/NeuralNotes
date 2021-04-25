import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

export default function NoteDetailsSnackbar({ error }) {
  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    // make a call to the function to retry sending the note
  };

  const errorMsg = error.text ? error.text : 'Some error...';

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        onClose={handleClose}
        message={errorMsg}
        action={
          <React.Fragment>
            <Button color="primary" size="small" onClick={handleClose}>
              RETRY
            </Button>
          </React.Fragment>
        }
      />
    </div>
  );
}
