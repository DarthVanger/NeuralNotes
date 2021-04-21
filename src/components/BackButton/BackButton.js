import React from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { colors } from 'colors';

export const BackButton = ({ to }) => (
  <Link to={to}>
    <IconButton edge="start" color="inherit" aria-label="back">
      <ArrowBackIcon style={{ fill: colors.textColor }} />
    </IconButton>
  </Link>
);
