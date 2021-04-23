import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from 'colors';

import { NoteDetailsContainer } from 'components/NoteDetails/NoteDetailsContainer';

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
