import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import {
  StyledNoteNameEditor,
  StyledNoteDetailsScreen,
  StyledNoteContentEditor,
} from 'components/NoteDetails/NoteDetailsStyles';

import {
  newNoteDiscardedAction,
  noteEditorOpenedAction,
} from './NoteDetailsActions';

const useStyles = makeStyles(theme => ({
  noteNameEditor: {
    ...theme.typography.h6,
    lineHeight: '56px',
    textAlign: 'center',
  },
  noteContentEditor: {
    ...theme.typography.body2,
  },
}));

export const NoteDetailsComponent = props => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [noteName, setNoteName] = useState(props.noteName);
  const [noteContent, setNoteContent] = useState(props.noteContent);

  const wasNoteEditedRef = useRef(false);

  const updateNoteName = (newNoteName, note, editorState) => {
    props.editorNoteNameChangedAction({
      newNoteName,
      note,
      editorState,
    });
  };

  const updateNoteContent = (noteContent, note, editorState) => {
    props.editorNoteContentChangedAction({
      noteContent,
      note,
      editorState,
    });
  };

  const debouncedUpdateNoteNameRef = useRef(
    debounce((...args) => updateNoteName(...args), 500),
  );
  const debouncedUpdateNoteContentRef = useRef(
    debounce((...args) => updateNoteContent(...args), 500),
  );

  // note content is fetched when the editor is opened, update state on fetch success
  useEffect(() => {
    setNoteContent(props.noteContent);
  }, [props.noteContent]);

  useEffect(() => {
    dispatch(noteEditorOpenedAction(props.selectedNote));

    return () => {
      if (!wasNoteEditedRef.current && !props.editorState.isExistingNote) {
        dispatch(newNoteDiscardedAction(props.selectedNote));
      }

      // apply the debounced changes immediately if user hits "back" before
      // the debounce wait interval passed
      debouncedUpdateNoteNameRef.current.flush();
      debouncedUpdateNoteContentRef.current.flush();
    };
  }, []);

  const handleNoteNameChange = e => {
    setNoteName(e.target.value);
    debouncedUpdateNoteNameRef.current(
      e.target.value,
      props.selectedNote,
      props.editorState,
    );
    wasNoteEditedRef.current = true;
  };

  const handleNoteContentChange = e => {
    setNoteContent(e.target.value);
    debouncedUpdateNoteContentRef.current(
      e.target.value,
      props.selectedNote,
      props.editorState,
    );
    wasNoteEditedRef.current = true;
  };

  const handleNoteNameKeyDown = e => {
    if (e.key === 'Enter') {
      history.push('/notes');
    }
  };

  return (
    <StyledNoteDetailsScreen>
      <StyledNoteNameEditor
        className={classes.noteNameEditor}
        type="text"
        onChange={handleNoteNameChange}
        onKeyDown={handleNoteNameKeyDown}
        value={noteName}
        placeholder="Title"
        rows="1"
        autoFocus
        onFocus={function(e) {
          // set cursor to the end, instead of beginning of input
          // https://stackoverflow.com/a/35951917/1657101
          var val = e.target.value;
          e.target.value = '';
          e.target.value = val;
        }}
      />
      <StyledNoteContentEditor
        className={classes.noteContentEditor}
        onChange={handleNoteContentChange}
        value={noteContent}
        placeholder="Note"
        rows="5"
      />
    </StyledNoteDetailsScreen>
  );
};
