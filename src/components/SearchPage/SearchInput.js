import React, { useState } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import { IconButton, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce/lib';
import { searchQueryChangeAction } from './SearchPageAction';
import { useEffect } from 'react';
import { colors } from 'colors';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles(() => ({
  multilineColor: {
    color: colors.iconColor,
  },
  customInput: {
    color: colors.iconColor,
    padding: '0px 10px',
  },
  list: {
    width: '100%',
    height: '100%',
    paddingLeft: 16,
    marginTop: -30,
  },
  listItem: {
    padding: 0,
    height: 64,
  },
  icon: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  svgIcon: {
    color: colors.iconColor,
  },
}));

export default function SearchInputComponent() {
  const dispatch = useDispatch();
  const defaultValue = '';

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    dispatch(searchQueryChangeAction(value));
  }, [value]);

  const debounced = useDebouncedCallback(
    (value, setValue) => setValue(value),
    100,
  );
  const classes = useStyles();
  return (
    <TextField
      className={classes.customInput}
      placeholder="Search notes and files"
      type="text"
      variant="outlined"
      size="small"
      onChange={e => debounced.callback(e.target.value, setValue)}
      value={value}
      InputProps={{
        classes: {
          input: classes.multilineColor,
        },
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon style={{ fill: colors.white60 }} />
          </InputAdornment>
        ),

        endAdornment: value && (
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => setValue('')}>
            <ClearIcon style={{ fill: colors.white60 }} />
          </IconButton>
        ),
      }}
    />
  );
}
