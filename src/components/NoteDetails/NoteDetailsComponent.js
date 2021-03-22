import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

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
    setAreChangesSaved(props.areChangesSaved);
  }, [props.areChangesSaved]);

  useEffect(() => {
    if (debouncedNoteName === props.noteName) return;
    props.editorNoteNameChangedAction({
      newNoteName: debouncedNoteName,
      note: props.selectedNote,
      isNewNote: props.isNewNote,
      isNoteCreationInProgress: props.isNoteCreationInProgress,
    });
  }, [debouncedNoteName]);

  useEffect(() => {
    if (debouncedNoteContent === props.noteContent) return;
    props.editorNoteContentChangedAction({
      noteContent: debouncedNoteContent,
      note: props.selectedNote,
      isNewNote: props.isNewNote,
      isNoteCreationInProgress: props.isNoteCreationInProgress,
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
      {!props.isNewNote && areChangesSaved && 'Saved to Google Drive'}
      {!props.isNewNote && !areChangesSaved && 'Saving...'}
      {props.isNoteCreationInProgress && 'Saving...'}
      <StyledNoteNameEditor
        onChange={handleNoteNameChange}
        value={noteName}
        placeholder="Title"
        rows="1"
      />
      <StyledNoteContentEditor
        onChange={handleNoteContentChange}
        value={noteContent}
        rows="5"
      />
    </StyledNoteDetailsScreen>
  );
};
