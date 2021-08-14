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
  textField: {
    color: colors.textColor,
  },
}));

export default function SearchInputComponent() {
  const dispatch = useDispatch();
  const defaultValue = '';

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    debouncedDispatchSearchQueryChangeAction.callback(value, dispatch);
  }, [value]);

  const debouncedDispatchSearchQueryChangeAction = useDebouncedCallback(
    (value, dispatch) => dispatch(searchQueryChangeAction(value)),
    500,
  );
  const classes = useStyles();
  return (
    <TextField
      autoFocus
      className={classes.textField}
      placeholder="Search notes and files"
      type="text"
      variant="outlined"
      size="small"
      onChange={e => setValue(e.target.value)}
      value={value}
      InputProps={{
        classes: {
          input: classes.textField,
        },
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon style={{ fill: colors.textColor }} />
          </InputAdornment>
        ),

        endAdornment: value && (
          <IconButton onClick={() => setValue('')}>
            <ClearIcon style={{ fill: colors.textColor }} />
          </IconButton>
        ),
      }}
    />
  );
}
