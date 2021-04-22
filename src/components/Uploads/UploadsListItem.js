import React from 'react';

import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import RetryIcon from '@material-ui/icons/CachedRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { colors } from 'colors';

import { UploadsActions } from './UploadsActions';

const useStyles = makeStyles(() => ({
  listItem: {
    padding: 0,
    height: '64px',
  },
}));

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
  padding-right: 16px;
  padding-left: 16px;
`;

const StyledIconButton = styled.button`
  width: 25px;
  height: 25px;
  background: none;
  border: none;
  outline: none;
  color: ${colors.textColor};
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
      return <Typography variant="body2">Uploaded</Typography>;
    }

    if (item.error) {
      return <Typography variant="body2">{item.error.message}</Typography>;
    }

    if (item.progress) {
      return (
        <LinearProgress value={item.progress.percent} variant="determinate" />
      );
    }

    return <Typography variant="body2">Initializing</Typography>;
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

  const classes = useStyles();

  return (
    <>
      <ListItem className={classes.listItem}>
        <StyledLeftContainer>
          <ListItemText>
            <Typography variant="subtitle1">{item.file.name}</Typography>
          </ListItemText>
          {renderStatus()}
        </StyledLeftContainer>
        <StyledRightContainer>
          {renderIconButton()}
          {renderProgress()}
        </StyledRightContainer>
      </ListItem>
      <Divider component="li" />
    </>
  );
};

UploadsListItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export { UploadsListItem };
