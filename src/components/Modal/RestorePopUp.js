import React from 'react';
import { colors } from '../../colors';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.minimal.css';

const PopUpDiv = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.mainBackground};
`;

const RestorePopup = props => {
  console.log(props);
  return (
    <>
      <ToastContainer
        style={{ padding: '0', background: `${colors.mainBackground}` }}
      />
      <PopUpDiv>
        <Typography style={{ width: '70%' }}>File moved to trash</Typography>
        <Button color="primary">UNDO</Button>
      </PopUpDiv>
    </>
  );
};

export default RestorePopup;
