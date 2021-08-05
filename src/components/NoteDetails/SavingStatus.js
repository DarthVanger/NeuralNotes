import React from 'react';
import { Typography } from '@material-ui/core';
import { StyledSavingStatus } from './NoteDetailsStyles';

const SavingStatus = ({ areChangesSaved, editorState }) => {
  const isSaved = editorState.isExistingNote && areChangesSaved;
  const isSaving = editorState.isNoteCreationInProgress || !areChangesSaved;

  return (
    <StyledSavingStatus>
      <Typography variant="subtitle2">
        {isSaved && 'Saved to Google Drive'}
        {isSaving && 'Saving...'}
        &nbsp; {/* makes it occupy space when there is no message */}
      </Typography>
    </StyledSavingStatus>
  );
};

export default SavingStatus;
