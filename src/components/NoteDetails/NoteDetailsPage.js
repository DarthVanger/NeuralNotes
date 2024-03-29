import React from 'react';
import styled from 'styled-components';
import { colors } from 'colors';
import { NoteDetailsContainer } from 'components/NoteDetails/NoteDetailsContainer';
import NoteDetailsTopBar from './NoteDetailsTopBar';

const Wrapper = styled.div`
  background: ${colors.elevationOverlay04dp};
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const NoteDetailsPage = () => {
  return (
    <Wrapper>
      <NoteDetailsTopBar />
      <NoteDetailsContainer />
    </Wrapper>
  );
};
