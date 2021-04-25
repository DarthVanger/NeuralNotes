import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

import {
  StyledNoteNameEditor,
  StyledNoteDetailsScreen,
  StyledNoteContentEditor,
} from './NoteDetailsStyles';
import NoteDetailsSaveStatus from './NoteDetailsSaveStatus';
import NoteDetailsSnackbar from './NoteDetailsSnackbar';

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
    saveNoteName();
  }, [debouncedNoteName]);

  useEffect(() => {
    if (debouncedNoteContent === props.noteContent) return;
    saveNoteContent();
  }, [debouncedNoteContent]);

  const saveNoteName = () => {
    props.editorNoteNameChangedAction({
      newNoteName: debouncedNoteName,
      note: props.selectedNote,
      editorState: props.editorState,
    });
  };

  const saveNoteContent = () => {
    props.editorNoteContentChangedAction({
      noteContent: debouncedNoteContent,
      note: props.selectedNote,
      editorState: props.editorState,
    });
  };

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
      <NoteDetailsSaveStatus
        editorState={props.editorState}
        areChangesSaved={areChangesSaved}
      />
      <StyledNoteNameEditor
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
        rows="5"
      />
      {/*<NoteDetailsSnackbar
        error={props.editorState.error}
        saveNoteName={saveNoteName}
        saveNoteContent={saveNoteContent}
      />*/}
      <NoteDetailsSnackbar
        error={{ text: 'test!!! name content' }}
        saveNoteName={saveNoteName}
        saveNoteContent={saveNoteContent}
      />
    </StyledNoteDetailsScreen>
  );
};
