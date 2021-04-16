import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { colors } from 'colors';

const useStyles = makeStyles({
  logoutButton: {
    fontSize: '16px',
    lineHeight: '24px',
    color: colors.white87,
    marginRight: '22px',
    textTransform: 'capitalize',
  },
});

export function LogoutButtonComponent({ logout }) {
  const classes = useStyles();
  return (
    <Button className={classes.logoutButton} onClick={logout}>
      Logout
    </Button>
  );
}
