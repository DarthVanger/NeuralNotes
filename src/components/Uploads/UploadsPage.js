import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { UploadsPageHeader } from './UploadsPageHeader';
import * as Selectors from './UploadsSelectors';
import { AttachmentsFileList } from './AttachmentsFileList';

const StyledPageContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const UploadsPage = () => {
  const uploads = useSelector(Selectors.getUploadsList);

  return (
    <StyledPageContainer>
      <UploadsPageHeader />
      <AttachmentsFileList uploads={uploads} />
    </StyledPageContainer>
  );
};

export { UploadsPage };
