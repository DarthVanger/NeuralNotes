import React, { useState, useEffect, useRef } from 'react';
import SavingStatus from './SavingStatus';
import debounce from 'lodash.debounce';

import {
  StyledNoteNameEditor,
  StyledNoteDetailsScreen,
  StyledNoteContentEditor,
} from 'components/NoteDetails/NoteDetailsStyles';

export const NoteDetailsComponent = props => {
  const [noteName, setNoteName] = useState(props.noteName);
  const [noteContent, setNoteContent] = useState(props.noteContent);
  const [areChangesSaved, setAreChangesSaved] = useState(true);

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
    setAreChangesSaved(props.editorState.areChangesSaved);
  }, [props.editorState.areChangesSaved]);

  const handleNoteNameChange = e => {
    setNoteName(e.target.value);
    setAreChangesSaved(false);
    debouncedUpdateNoteNameRef.current(
      e.target.value,
      props.selectedNote,
      props.editorState,
    );
  };

  const handleNoteContentChange = e => {
    setNoteContent(e.target.value);
    setAreChangesSaved(false);
    debouncedUpdateNoteContentRef.current(
      e.target.value,
      props.selectedNote,
      props.editorState,
    );
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
