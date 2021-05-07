import React from 'react';
import styled from 'styled-components';
import { Link, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
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
      <Typography>
        File deleted, you can restore it from &nbsp;
        <Link
          color="inherit"
          href="https://drive.google.com/drive/trash"
          target="_blank">
          Google Drive Trash
        </Link>
      </Typography>
      <CloseIcon onClick={closeToast} />
    </PopUpDiv>
  );
};

export default RestorePopup;
