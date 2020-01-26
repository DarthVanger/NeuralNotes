import styled from 'styled-components';

export const Img = styled.img`
  width: 100%;
  height: auto;
  filter: ${props =>
    props.shadow ? 'drop-shadow( 0px 7px 4px rgba(0, 0, 0, .3))' : 'none'};
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

//aspect ratio of the slide in the layout (375px/334px)
export const ASPECT_RATIO = 375 / 334;

export const FONT_SIZE = {
  H1: '7vmin',
  H2: '4.5vmin',
  H3: '2.5vmin',
};
