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

  const isSaved =
    props.editorState.isExistingNote && props.editorState.areChangesSaved;
  const isSaving =
    props.editorState.isNoteCreationInProgress ||
    !props.editorState.areChangesSaved;

  return (
    <StyledNoteDetailsScreen>
      {isSaved && 'Saved to Google Drive'}
      {isSaving && 'Saving...'}
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
