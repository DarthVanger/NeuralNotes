import React from 'react';
import styled from 'styled-components';
import { colors } from 'colors';
import { NoteDetailsContainer } from 'components/NoteDetails/NoteDetailsContainer';
import NoteDetailsTopBar from './NoteDetailsTopBar';
import DialogDeleteNote from 'components/Modal/DialogDeleteNote';
import { useState } from 'react';

const Wrapper = styled.div`
  background: ${colors.barBackground};
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const NoteDetailsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Wrapper>
      <NoteDetailsTopBar openDialog={() => setIsDialogOpen(true)} />
      <NoteDetailsContainer />
      <DialogDeleteNote
        isDialogOpen={isDialogOpen}
        closeDialog={() => setIsDialogOpen(false)}
      />
    </Wrapper>
  );
};
