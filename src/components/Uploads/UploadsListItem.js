import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { UploadsActions } from './UploadsActions';
import LinearProgress from '@material-ui/core/LinearProgress';
import { colors } from '../../colors';
import RetryIcon from '@material-ui/icons/CachedRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import { Typography } from '@material-ui/core';


const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5em 1em;
  height: 60px;

  color: ${colors.white60};
  background: ${colors.dialogsGray};

  & + div {
    border-top: solid 1px gray;
  }
`;

const StyledLeftContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const StyledFileName = styled.div`
  font-size: 14px;
  color: black;
`;

const StyledSuccessStatus = styled.div`
  font-size: 12px;
  color: lightgreen;
`;

const StyledFailureStatus = styled.div`
  font-size: 12px;
  color: red;
`;

const StyledInitializingStatus = styled.div`
  font-size: 12px;
  color: ${colors.white87};
`;

const StyledStatus = styled.div`
  color: ${colors.white60};
`;

const StyledIconButton = styled.button`
  width: 25px;
  height: 25px;
  background: none;
  border: none;
  outline: none;
`;

const StyledProgressLabel = styled.div`
  font-size: 11px;
  color: ${colors.white60};
`;

const UploadsListItem = ({ item }) => {
  const dispatch = useDispatch();

  function cancelUpload() {
    dispatch(UploadsActions.file.cancelUpload(item.file));
  }

  function retryUpload() {
    dispatch(UploadsActions.file.retryUpload(item.file));
  }

  function renderStatus() {
    if (item.result) {
      return (
        <StyledStatus>
          <Typography variant="body2">Uploaded</Typography>
        </StyledStatus>
      );
    }

    if (item.error) {
      return (
        <StyledStatus>
          <Typography variant="body2">{item.error.message}</Typography>
        </StyledStatus>
      );
    }

    if (item.progress) {
      return (
        <LinearProgress value={item.progress.percent} variant="determinate" />
      );
    }

    return (
      <StyledStatus>
        <Typography variant="body2">Initializing</Typography>
      </StyledStatus>
    );
  }

  function renderIconButton() {
    if (item.initializing || item.result) {
      return null;

    }

    if (item.error) {
      return (
        <StyledIconButton onClick={retryUpload}>
          <RetryIcon />
        </StyledIconButton>
      );
    }

    return (
      <StyledIconButton onClick={cancelUpload}>
        <PauseRoundedIcon />
      </StyledIconButton>
    );

  }

  function renderProgress() {
    if (!item.progress || item.result) {
      return null;
    }


    return <Typography variant="body2">{item.progress.percent}%</Typography>;
  }

  return (
    <StyledContainer>
      <StyledLeftContainer>
        <StyledFileName>
          <Typography variant="subtitle1">{item.file.name}</Typography>
        </StyledFileName>

        {renderStatus()}
      </StyledLeftContainer>
      <StyledRightContainer>
        {renderIconButton()}
        {renderProgress()}
      </StyledRightContainer>
    </StyledContainer>
  );
};

UploadsListItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export { UploadsListItem };
