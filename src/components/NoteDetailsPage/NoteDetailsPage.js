import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// import { useDispatch } from 'react-redux';
// import { PAGES_ENUM } from 'components/App/AppConstants';
// import { CHANGE_PAGE_ACTION } from 'components/App/AppActions';
import { NoteDetailsContainer } from 'components/NoteDetails/NoteDetailsContainer';

const Wrapper = styled.div`
  background-color: #2b2630;
`;

const BackButtonWrapper = styled.div`
  color: red !important;
  padding: 1rem;
`;

export const NoteDetailsPage = () => {
  // const dispatch = useDispatch();

  // const handleClick = () => {
  //   dispatch({ type: CHANGE_PAGE_ACTION, data: PAGES_ENUM.NOTE_DETAILS });
  // };
  return (
    <Wrapper>
      <BackButtonWrapper>
        <IconButton aria-label="back">
          <ArrowBackIcon style={{ fill: '#E4E3E4' }} />
        </IconButton>
      </BackButtonWrapper>
      <NoteDetailsContainer />
      {/* <StyledButton onClick={handleClick}>View/Edit Note</StyledButton>; */}
    </Wrapper>
  );
};
