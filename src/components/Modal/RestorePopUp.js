import React from 'react';
import { colors } from '../../colors';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.minimal.css';
import './popstyle.css';

const PopUpDiv = styled.div`
  display: flex;
  align-items: center;
  background-color: #121212;
`;

const RestorePopup = ({ closeToast }) => {
  return (
    <>
      <PopUpDiv>
        <Typography style={{ width: '70%' }}>File moved to trash</Typography>
        <Button color="primary">UNDO</Button>
        <CloseIcon onClick={closeToast} />
      </PopUpDiv>
    </>
  );
};

export default RestorePopup;
