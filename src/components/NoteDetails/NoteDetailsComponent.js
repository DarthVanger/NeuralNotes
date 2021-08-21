import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import SavingStatus from './SavingStatus';

import {
  StyledNoteNameEditor,
  StyledNoteDetailsScreen,
  StyledNoteContentEditor,
} from 'components/NoteDetails/NoteDetailsStyles';

export const NoteDetailsComponent = props => {
  const [noteName, setNoteName] = useState(props.noteName);
  const [noteContent, setNoteContent] = useState(props.noteContent);
  const [debouncedNoteName] = useDebounce(noteName, 1000);
  const [debouncedNoteContent] = useDebounce(noteContent, 1000);
  const [areChangesSaved, setAreChangesSaved] = useState(true);

  useEffect(() => {
    setNoteContent(props.noteContent);
  }, [props.noteContent]);

  useEffect(() => {
    setAreChangesSaved(props.editorState.areChangesSaved);
  }, [props.editorState.areChangesSaved]);

  useEffect(() => {
    if (debouncedNoteName === props.noteName) return;
    props.editorNoteNameChangedAction({
      newNoteName: debouncedNoteName,
      note: props.selectedNote,
      editorState: props.editorState,
    });
  }, [debouncedNoteName]);

  useEffect(() => {
    if (debouncedNoteContent === props.noteContent) return;
    props.editorNoteContentChangedAction({
      noteContent: debouncedNoteContent,
      note: props.selectedNote,
      editorState: props.editorState,
    });
  }, [debouncedNoteContent]);

  const handleNoteNameChange = e => {
    setNoteName(e.target.value);
    setAreChangesSaved(false);
  };

  const handleNoteContentChange = e => {
    setNoteContent(e.target.value);
    setAreChangesSaved(false);
  };

  return (
    <StyledNoteDetailsScreen>
      <SavingStatus
        areChangesSaved={areChangesSaved}
        editorState={props.editorState}
      />
      <StyledNoteNameEditor
        type="text"
        onChange={handleNoteNameChange}
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
        onChange={handleNoteContentChange}
        value={noteContent}
        placeholder="Note"
        rows="5"
      />
    </StyledNoteDetailsScreen>
  );
};
