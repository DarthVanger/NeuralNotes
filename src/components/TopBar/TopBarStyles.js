import styled from 'styled-components';

const bottomLineHeight = 1;
const topBarHeight = 56;

export const StyledHeader = styled.header`
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  width: 100%;
  height: ${topBarHeight + bottomLineHeight}px;
  background-color: #2a2a2a;
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14),
    0px 1px 2px rgba(0, 0, 0, 0.2);
`;

export const StyledLogo = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 19px;
  padding-left: 53px;
  line-height: 22px;
  color: #3c78c8;
`;

export const StyledControls = styled.nav`
  width: 115px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

export const StyledIcon = styled.img`
  width: ${props => props.width || '24px'};
  height: ${props => props.height || '24px'};
`;

export const StyledBottomLine = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: ${bottomLineHeight}px;
  background: linear-gradient(
    270deg,
    rgba(60, 120, 200, 0) 8.33%,
    #3c78c8 50%,
    rgba(60, 120, 200, 0) 91.67%
  );
`;
