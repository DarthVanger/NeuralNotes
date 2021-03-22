import React from 'react';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  topBarPageTitle: {
    flexGrow: 1,
  },
}));

export const TopBarPageTitle = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <div className={classes.topBarPageTitle}>
      <Typography
        variant="h6"
        style={{ color: 'rgba(255, 255, 255, 0.87)' }}
        {...props}>
        {children}
      </Typography>
    </div>
  );
};
