import React from 'react';
import styled from 'styled-components';
import { colors } from 'colors';
import { NoteDetailsContainer } from 'components/NoteDetails/NoteDetailsContainer';
import NoteDetailsTopBar from './NoteDetailsTopBar';
import { useState } from 'react';

const Wrapper = styled.div`
  background: ${colors.barBackground};
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const BackButtonWrapper = styled.div`
  flex-grow: 0;
  padding: 0.5rem;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const NoteDetailsPage = () => {
  return (
    <Wrapper>
      <NoteDetailsTopBar />
      <NoteDetailsContainer />
    </Wrapper>
  );
};
