import styled from 'styled-components';

export const Img = styled.img`
  width: 100%;
  height: auto;
  filter: ${props => props.shadow ? "drop-shadow( 0px 7px 4px rgba(0, 0, 0, .3))" : "none"} ;
`;

export const Caption = styled.svg`
  font-weight: ${props => props.fontWeight || 300};
  position: absolute;
  width: ${props => props.width};
  top: ${props => props.top};
  left: ${props => props.left};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
`;
