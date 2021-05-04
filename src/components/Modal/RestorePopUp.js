import React from 'react';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './restorePopUp.css';
import { colors } from '../../colors';

const PopUpDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: ${colors.systemBarBack};
`;

const RestorePopup = ({ closeToast }) => {
  return (
    <PopUpDiv>
      <Typography>File moved to trash</Typography>
      <Button color="primary">UNDO</Button>
      <CloseIcon onClick={closeToast} />
    </PopUpDiv>
  );
};

export default RestorePopup;
