import React from 'react';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';

import {
  IconButton,
  makeStyles,
  Paper,
  Popover,
  Typography,
} from '@material-ui/core';
import { colors } from '../../colors';

const useStyles = makeStyles(() => ({
  popBody: {
    height: 60,
    width: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.white87,
    backgroundColor: colors.mainGray,
  },
}));

export default function PopupRestore({ handleClose, open }) {
  const classes = useStyles();
  return (
    <div>
      <Popover
        className={classes.dialog}
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 900, left: 100 }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <Paper className={classes.popBody}>
          <Typography>File moved to trash</Typography>
          <Button onClick={handleClose} color="primary" size="small">
            UNDO
          </Button>
          <IconButton onClick={handleClose}>
            <ClearIcon style={{ fill: colors.white60 }} />
          </IconButton>
        </Paper>
      </Popover>
    </div>
  );
}
