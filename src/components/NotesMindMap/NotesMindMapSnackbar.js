import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  snackbar: {
    // On mobile snackbar should appear above the FABs, see
    // https://material-ui.com/components/snackbars/#snackbars-and-floating-action-buttons-fabs
    [theme.breakpoints.down('xs')]: {
      bottom: 170,
    },
  },
}));

const NotesMindMapSnackbar = props => {
  const classes = useStyles();

  return <Snackbar className={classes.snackbar} {...props} />;
};

export default NotesMindMapSnackbar;
