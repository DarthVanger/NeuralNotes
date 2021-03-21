import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';

import {
  StyledNoteNameEditor,
  StyledNoteDetailsScreen,
  StyledNoteContentEditor,
} from 'components/NoteDetails/NoteDetailsStyles';

import { debounce } from 'helpers/debounce';

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
    props.onNoteNameChange({
      newNoteName: debouncedNoteName,
      note: props.selectedNote,
    });
  }, [debouncedNoteName]);

  useEffect(() => {
    if (debouncedNoteContent === props.noteContent) return;
    props.onNoteContentChange({
      noteContent: debouncedNoteContent,
      note: props.selectedNote,
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
      {areChangesSaved && 'Saved to Google Drive'}
      {!areChangesSaved && 'Saving...'}
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
