import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from 'colors';

import { NoteDetailsContainer } from 'components/NoteDetails/NoteDetailsContainer';

const Wrapper = styled.div`
  background: ${colors.barBackground};
`;

const BackButtonWrapper = styled.div`
  padding: 0.5rem;
`;

export const NoteDetailsPage = () => {
  return (
    <Wrapper>
      <BackButtonWrapper>
        <Link to="/notes">
          <IconButton aria-label="back">
            <ArrowBackIcon style={{ fill: colors.textColor }} />
          </IconButton>
        </Link>
      </BackButtonWrapper>
      <NoteDetailsContainer />
    </Wrapper>
  );
};
