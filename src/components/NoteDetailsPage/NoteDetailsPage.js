import React from 'react';
import styled from 'styled-components';
// import { useDispatch } from 'react-redux';
// import { PAGES_ENUM } from 'components/App/AppConstants';
// import { CHANGE_PAGE_ACTION } from 'components/App/AppActions';
import { NoteDetailsContainer } from 'components/NoteDetails/NoteDetailsContainer';

const FlexContainer = styled.div`
  position: absolute;
  width: 100vw;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 5rem;
`;

const Wrapper = styled.div``;

// const StyledButton = styled.button`
//   width: 10rem;
//   height: 2rem;
//   color: #bb86fc;
//   background-color: #232323;
//   border: 1px solid #bb86fc;
//   font-size: 1rem;
// `;

export const NoteDetailsPage = () => {
  // const dispatch = useDispatch();

  // const handleClick = () => {
  //   dispatch({ type: CHANGE_PAGE_ACTION, data: PAGES_ENUM.NOTE_DETAILS });
  // };
  return (
    <>
      <Wrapper>
        <NoteDetailsContainer />
        {/* <StyledButton onClick={handleClick}>View/Edit Note</StyledButton>; */}
      </Wrapper>
    </>
  );
};
