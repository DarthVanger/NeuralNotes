import styled from 'styled-components';

export const StyledOpenFileButton = styled.button`
  position: relative;
  top: 57px;
  width: 100%;
  z-index: 1;
  height: 41px;
  background: linear-gradient(
    90deg,
    rgba(24, 24, 24, 0.65) 0%,
    #2a2a2a 50.05%,
    rgba(24, 24, 24, 0.65) 100%
  );
  color: #959595;
  font-family: Roboto;
  font-style: normal;
  font-size: 19px;
  line-height: 22px;
  text-align: center;
  border-left: none;
  border-right: none;
  border-top: none;
  border-bottom: 1px solid;
  border-image: linear-gradient(
      to right,
      rgba(60, 120, 200, 0) 8.33%,
      #3c78c8 50%,
      rgba(60, 120, 200, 0) 91.67%
    )
    47% 0%;
  box-shadow: 0px -4px 6px rgba(0, 0, 0, 0.12), 0px -2px 4px rgba(0, 0, 0, 0.14),
    0px -1px 2px rgba(0, 0, 0, 0.2);
`;
