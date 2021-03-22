import React from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export const BackButton = ({ to }) => (
  <Link to={to}>
    <IconButton edge="start" color="inherit" aria-label="back">
      <ArrowBackIcon style={{ fill: '#BB86FC' }} />
    </IconButton>
  </Link>
);
