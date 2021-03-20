import React from 'react';

import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GoogleDriveIcon } from 'icons/GoogleDriveIcon/GoogleDriveIcon';
import noteStorage from 'storage/noteStorage';

const useStyles = makeStyles({
  button: {
    fontWeight: '600',
    lineHeight: 0.99,
  },
  buttonLink: {
    textDecoration: 'none',
  },
});

export function OpenFileButtonComponent(props) {
  const classes = useStyles();
  const { selectedNote } = props;
  const link = noteStorage.getLinkToNote(selectedNote);

  return (
    <a
      href={link}
      target="_blank"
      className={classes.buttonLink}
      rel="noopener noreferrer">
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<GoogleDriveIcon />}>
        OPEN
      </Button>
    </a>
  );
}
