import React from 'react';

import styled from 'styled-components';
import { colors } from 'colors';

import { NoteDetailsContainer } from 'components/NoteDetails/NoteDetailsContainer';

import NoteDetailsTopBar from './NoteDetailsTopBar';
import ModalDeleteComponent from 'components/ModalDelete/ModalDeleteComponent';
import { useState } from 'react';

const Wrapper = styled.div`
  background-color: ${colors.darkViolet};
`;

export const NoteDetailsPage = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Wrapper>
      <NoteDetailsTopBar handleClickOpen={handleClickOpen} />
      <ModalDeleteComponent open={open} handleClose={handleClose} />
      <NoteDetailsContainer />
    </Wrapper>
  );
};
