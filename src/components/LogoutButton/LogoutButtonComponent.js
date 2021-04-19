import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
  button: {
    textTransform: 'capitalize',
  },
});

export function LogoutButtonComponent({ logout }) {
  const classes = useStyles();
  return (
    <Button className={classes.button} onClick={logout}>
      <Typography variant="subtitle1">Logout</Typography>
    </Button>
  );
}
