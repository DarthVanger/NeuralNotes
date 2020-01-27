import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  width: 100%;

  .progress-bar {
    height: 5px;
    background-color: blue;
  }

  .tick {
    height: 5px;
    background-color: lightblue;
    width: 20%;
    animation: tick linear 1s infinite;

    @keyframes tick {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(400%);
      }
    }
  }
`;

const UploadingProgressBar = ({ progress }) => {
  console.log(`${Math.trunc(progress * 100)}%`);
  return (
    <StyledContainer>
      <div
        className="progress-bar"
        style={{ width: `${Math.trunc(progress * 100)}%` }}>
        <div className="tick" />
      </div>
    </StyledContainer>
  );
};

export { UploadingProgressBar };
