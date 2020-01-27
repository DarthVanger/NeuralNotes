import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { UploadingProgressBar } from './UploadingProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faCheck,
  faRedo,
} from '@fortawesome/free-solid-svg-icons';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5em 1em;
  height: 60px;

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
  font-size: 11px;
`;

const AttachmentListItem = ({ item }) => {
  return (
    <StyledContainer>
      <StyledLeftContainer>
        <StyledFileName>{item.file.name}</StyledFileName>
        {item.status === 'done' && (
          <StyledSuccessStatus>Uploaded</StyledSuccessStatus>
        )}
        {['started', 'uploading'].includes(item.status) && (
          <UploadingProgressBar progress={item.progress} />
        )}
        {item.status === 'error' && (
          <StyledFailureStatus>{item.error.message}</StyledFailureStatus>
        )}
        {!['done', 'started', 'uploading', 'error'].includes(item.status) && (
          <StyledInitializingStatus>Initializing</StyledInitializingStatus>
        )}
      </StyledLeftContainer>
      <StyledRightContainer>
        {!['error', 'done'].includes(item.status) && (
          <StyledIconButton>
            <FontAwesomeIcon icon={faTimesCircle} />
          </StyledIconButton>
        )}
        {item.status === 'done' && (
          <StyledIconButton>
            <FontAwesomeIcon icon={faCheck} />
          </StyledIconButton>
        )}
        {item.status === 'error' && (
          <StyledIconButton>
            <FontAwesomeIcon icon={faRedo} />
          </StyledIconButton>
        )}
        {['started', 'uploading'].includes(item.status) && (
          <StyledProgressLabel>
            {Math.trunc(item.progress * 100)}%
          </StyledProgressLabel>
        )}
      </StyledRightContainer>
    </StyledContainer>
  );
};

AttachmentListItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export { AttachmentListItem };
