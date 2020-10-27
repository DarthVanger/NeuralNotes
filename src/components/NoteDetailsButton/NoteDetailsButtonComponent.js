import React from 'react';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import { Link } from 'react-router-dom';

const FlexContainer = styled.div`
  position: absolute;
  width: 100vw;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 5rem;
`;

export const NoteDetailsButtonComponent = () => {
  return (
    <FlexContainer>
      <Link to="/note">
        <IconButton aria-label="note" color="primary">
          <EditIcon />
        </IconButton>
      </Link>
    </FlexContainer>
  );
};
