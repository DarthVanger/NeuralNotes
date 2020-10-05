import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { UploadsActions } from './UploadsActions';
import LinearProgress from '@material-ui/core/LinearProgress';
import RetryIcon from '@material-ui/icons/Sync';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5em 1em;
  height: 60px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;

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
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: black;
`;

const StyledSuccessStatus = styled.div`
  color: lightgreen;
`;

const StyledFailureStatus = styled.div`
  color: red;
`;

const StyledInitializingStatus = styled.div`
  color: gray;
`;

const StyledIconButton = styled.button`
  width: 25px;
  height: 25px;
  background: none;
  border: none;
  outline: none;
`;

const StyledProgressLabel = styled.div`
  font-size: 14px;
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
      return <StyledSuccessStatus>Uploaded</StyledSuccessStatus>;
    }

    if (item.error) {
      return <StyledFailureStatus>{item.error.message}</StyledFailureStatus>;
    }

    if (item.progress) {
      return (
        <LinearProgress value={item.progress.percent} variant="determinate" />
      );
    }

    return <StyledInitializingStatus>Initializing</StyledInitializingStatus>;
  }

  function renderIconButton() {
    if (item.result) {
      return <StyledIconButton>&#10004;</StyledIconButton>;
    }

    if (item.error) {
      return (
        <StyledIconButton onClick={retryUpload}>
          <RetryIcon />
        </StyledIconButton>
      );
    }

    return <StyledIconButton onClick={cancelUpload}>&#10006;</StyledIconButton>;
  }

  function renderProgress() {
    if (!item.progress || item.result) {
      return null;
    }

    return <StyledProgressLabel>{item.progress.percent}%</StyledProgressLabel>;
  }

  return (
    <StyledContainer>
      <StyledLeftContainer>
        <StyledFileName>{item.file.name}</StyledFileName>
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
