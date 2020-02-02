import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { UploadsEmptyList } from './UploadsEmptyList';
import { UploadsListItem } from './UploadsListItem';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const UploadsFileList = ({ uploads }) => {
  if (uploads.length === 0) {
    return <UploadsEmptyList />;
  }

  return (
    <StyledContainer>
      {uploads.map(item => (
        <UploadsListItem key={item.name} item={item} />
      ))}
    </StyledContainer>
  );
};

UploadsFileList.propTypes = {
  uploads: PropTypes.array.isRequired,
};

export { UploadsFileList };
