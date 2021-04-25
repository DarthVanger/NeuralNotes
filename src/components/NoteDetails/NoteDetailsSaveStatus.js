import React from 'react';
import { Typography } from '@material-ui/core';

function NoteDetailsSaveStatus({ editorState, areChangesSaved }) {
  let statusText = '';

  if (editorState.error) {
    statusText = editorState.error.text;
  } else if (editorState.isNoteCreationInProgress || !areChangesSaved) {
    statusText = 'Saving...';
  } else if (editorState.isExistingNote && areChangesSaved) {
    statusText = 'Saved to Google Drive';
  }

  return <Typography variant="subtitle2">{statusText}</Typography>;
}

export default NoteDetailsSaveStatus;
