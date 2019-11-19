import React, { Component } from 'react';
import styled from 'styled-components';
import slideImage from 'components/LoginPage/images/slide-2.svg';

const Slide = styled.section`
  padding-bottom: 10%;
  text-align: center;

  .shadow {
  -webkit-filter: drop-shadow( 0px 7px 4px rgba(0, 0, 0, .3));
  filter: drop-shadow( 0px 7px 4px rgba(0, 0, 0, .3));
}
`;
const H3 = styled.h3`
  padding-bottom: 7%;
  font-size: calc(13px + (24 - 13)*(100vw - 375px)/(1200 - 375));
  text-align: center;
  color: #ffffff;
`;
const Figure = styled.figure`
  position: relative;
  width: 74%;
  margin: auto;
  height: auto;
`;
const Img = styled.img`
  width: 100%;
  height: auto;
`;
const Caption = styled.svg`
  font-weight: ${props => props.fontWeight || 300};
  position: absolute;
  width: ${props => props.width};
  top: ${props => props.top};
  left: ${props => props.left};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
`;

const CaptionSvgTextBox = ({viewBoxWidth = 60, viewBoxHeight = 15, ...rest}) => {
  return <Caption viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} {...rest} />;
};
const CaptionSvgText = ({x = 0, y = 12, fill = "#96FFFF", text}) => {
  return <text x={x} y={y} fill={fill}>{text}</text>;
};

export default class Slide2 extends Component {
    render() {
        return (
          <Slide>
            <H3><b>Create Notes</b>
              <br />
              As A Mind Map</H3>
            <Figure>
              <Img src={slideImage} className="shadow"/>
              <CaptionSvgTextBox left="14.5%" top="11%" width="9.5%">
                  <CaptionSvgText text="Chill"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox left="4.5%" top="35%" width="9.5%">
                  <CaptionSvgText text="Rock"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox left="4.5%" top="71%" width="9.5%">
                  <CaptionSvgText text="Art"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox left="46.5%" top="88%" width="9.5%">
                  <CaptionSvgText text="Quotes"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox viewBoxHeight="36" left="50%" top="6%" width="9.5%">
                  <CaptionSvgText text="Berlin"/>
                  <CaptionSvgText x="2" y="32" text="2019"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox viewBoxHeight="36" left="88.5%" top="12%" width="9.5%">
                  <CaptionSvgText text="Japan"/>
                  <CaptionSvgText x="5" y="32" text="2018"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox left="87%" top="54%" width="9.5%">
                  <CaptionSvgText text="Keep fit"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox viewBoxHeight="36" left="83.5%" top="80%" width="9.5%">
                  <CaptionSvgText x="5" text="Visit"/>
                  <CaptionSvgText y="32" text="Africa"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox left="26.5%" top="31.5%" width="10.5%">
                  <CaptionSvgText text="Music"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox viewBoxWidth="80" viewBoxHeight="20" left="21%" top="73.5%" width="14%">
                  <CaptionSvgText text="Inspiration"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox left="67.25%" top="25%" width="10.5%">
                  <CaptionSvgText text="Travel"/>
                </CaptionSvgTextBox>
                <CaptionSvgTextBox left="66%" top="58.5%" width="10.5%">
                  <CaptionSvgText text="Dreams"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox viewBoxWidth="100" viewBoxHeight="21" left="41.5%" top="41%" width="18.5%" fontWeight="700">
                  <CaptionSvgText x="6" y="18" fill="#131C3E" text="NeuralNotes"/>
                </CaptionSvgTextBox>
            </Figure>
          </Slide>
        );
    }
};
