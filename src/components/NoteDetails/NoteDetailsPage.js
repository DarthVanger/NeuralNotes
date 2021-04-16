import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { NoteDetailsContainer } from 'components/NoteDetails/NoteDetailsContainer';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { BottomBarMenu } from 'components/BottomBar/BottomBarMenu';

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
      <BottomBarMenu />
      <NoteDetailsContainer />
    </Wrapper>
  );
};

{
  /* <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}>
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu> */
}
