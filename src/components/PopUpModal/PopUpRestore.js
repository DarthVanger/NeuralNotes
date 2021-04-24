import React from 'react';
import Button from '@material-ui/core/Button';
import { colors } from '../../colors';

import { makeStyles, Paper, Popover, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  popBody: {
    height: 50,
    width: 250,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.textColor,
    background: colors.menuBackground,
    borderRadius: 0,
  },
}));

export default function PopupRestore({ handleClose, open }) {
  const classes = useStyles();
  return (
    <div>
      <Popover
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 1900, left: 100 }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <Paper className={classes.popBody} elevation={9}>
          <Typography>File moved to trash</Typography>
          <Button onClick={handleClose} color="primary" size="small">
            UNDO
          </Button>
        </Paper>
      </Popover>
    </div>
  );
}
