import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { NoteDetailsContainer } from 'components/NoteDetails/NoteDetailsContainer';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  background-color: #2b2630;
`;

const BackButtonWrapper = styled.div`
  color: red !important;
  padding: 1rem;
`;

export const NoteDetailsPage = () => {
  return (
    <Wrapper>
      <BackButtonWrapper>
        <Link to="/notes">
          <IconButton aria-label="back">
            <ArrowBackIcon style={{ fill: '#E4E3E4' }} />
          </IconButton>
        </Link>
      </BackButtonWrapper>
      <NoteDetailsContainer />
    </Wrapper>
  );
};
