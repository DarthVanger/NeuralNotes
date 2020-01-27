import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { AttachmentsEmptyList } from './AttachmentsEmptyList';
import { AttachmentListItem } from './AttachmentListItem';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AttachmentsFileList = ({ uploads }) => {
  if (uploads.length === 0) {
    return <AttachmentsEmptyList />;
  }

  return (
    <StyledContainer>
      {uploads.map(item => (
        <AttachmentListItem key={item.name} item={item} />
      ))}
    </StyledContainer>
  );
};

AttachmentsFileList.propTypes = {
  uploads: PropTypes.array.isRequired,
};

export { AttachmentsFileList };
