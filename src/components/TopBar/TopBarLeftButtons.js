import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  topBarLeftButtons: {
    marginRight: theme.spacing(2),
  },
}));

export const TopBarLeftButtons = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.topBarLeftButtons}>{children}</div>;
};
