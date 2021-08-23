import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SyncIcon from '@material-ui/icons/Sync';
import useGraph from 'components/NotesMindMap/hooks/useGraph';

const useStyles = makeStyles({
  container: {
    display: 'inline-block',
    marginLeft: '2em',
  },
  typography: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

const SavingStatus = () => {
  const classes = useStyles();
  const graph = useGraph();
  const isSaving = graph.nodes.some(n => n.isSaving);

  if (!isSaving) return null;

  return (
    <div className={classes.container}>
      <Typography variant="subtitle2" className={classes.typography}>
        <SyncIcon fontSize="inherit" />
        &nbsp; Saving...
      </Typography>
    </div>
  );
};

export default SavingStatus;
