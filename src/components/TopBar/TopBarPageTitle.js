import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'colors';

const useStyles = makeStyles(() => ({
  topBarPageTitle: {
    flexGrow: 1,
  },
}));

export const TopBarPageTitle = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <div className={classes.topBarPageTitle}>
      <Typography variant="h6" style={{ color: colors.white87 }} {...props}>
        {children}
      </Typography>
    </div>
  );
};
