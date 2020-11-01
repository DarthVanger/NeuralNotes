import React from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import { UploadsListEmpty } from './UploadsListEmpty';
import { UploadsListItem } from './UploadsListItem';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const UploadsList = ({ list }) => {
  if (list.length === 0) {
    return <UploadsListEmpty />;
  }

  return (
    <StyledContainer>
      {list.map(item => (
        <UploadsListItem key={item.name} item={item} />
      ))}
    </StyledContainer>
  );
};

UploadsList.propTypes = {
  list: PropTypes.array.isRequired,
};

export { UploadsList };
