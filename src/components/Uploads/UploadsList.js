import React from 'react';

import { List } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { UploadsListEmpty } from './UploadsListEmpty';
import { UploadsListItem } from './UploadsListItem';

const useStyles = makeStyles(() => ({
  list: {
    width: '100%',
    minHeight: '100%',
    paddingLeft: '16px',
  },
}));

const UploadsList = ({ list }) => {
  if (list.length === 0) {
    return <UploadsListEmpty />;
  }

  const classes = useStyles();

  return (
    <List className={classes.list}>
      {list.map(item => (
        <UploadsListItem key={item.session} item={item} />
      ))}
    </List>
  );
};

UploadsList.propTypes = {
  list: PropTypes.array.isRequired,
};

export { UploadsList };
