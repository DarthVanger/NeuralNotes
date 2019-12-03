import React, { Component } from 'react';
import styled from 'styled-components';
import imageMindmap from 'components/LoginPage/images/slide-5-mindmap.svg';
import arrow from 'components/LoginPage/images/arrow.svg';

const Slide = styled.section`
  position: relative;
   .shadow {
    -webkit-filter: drop-shadow( 0px 7px 4px rgba(0, 0, 0, .3));
    filter: drop-shadow( 0px 7px 4px rgba(0, 0, 0, .3));
    }
  .hint-old-notes {
    position: absolute;
    right: 5%;
    width: 22%;
    height: 11%;
    top: 22%;
    img {
      width: 12%;
      position: absolute;
      bottom: 2%;
      left: 44%;
    }
  }
  .hint-recent-notes {
    position: absolute;
    left: 13%;
    bottom: 3%;
    width: 26%;
    height: 13%;
    img {
      width: 12%;
      position: absolute;
      top: 2%;
      left: 44%;
    }
  }
`;
const H3 = styled.h3`
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 4vmin;
  text-align: center;
  color: #ffffff;
`;
const Figure = styled.figure`
  width: 100%;
  height: auto;
  position: relative;
`;
const Img = styled.img`
  width: 100%;
  height: auto;
`;
const ArrowUp = styled.img`
  width: 2%;
  height: auto;
`;
const ArrowDown = styled.img`
  width: 2%;
  height: auto;
  transform: rotate(180deg);
`;
const Hint = styled.div`
  background: #0E1736;
  border-radius: 1vw;
  box-shadow: inset 0px 4px 2px rgba(0, 0, 0, 0.25);
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

const CaptionSvgTextBox = ({ viewBoxWidth = 60, viewBoxHeight = 40, ...rest }) => {
    return <Caption viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} {...rest} />;
};
const CaptionSvgText = ({ x = 0, y = 12, fill = "#96FFFF", text }) => {
    return <text x={x} y={y} fill={fill}>{text}</text>;
};

export default class Slide5 extends Component {
    render() {
      return (
        <Slide>
            <H3>Frequently used notes<br />get bigger</H3>
            <Hint className='hint-old-notes'>
              <CaptionSvgTextBox viewBoxWidth="160" viewBoxHeight="40" left="3%" top="10%" width="94%" fontWeight="700">
                <CaptionSvgText x="6" y="18" fill="#E8E9F8" text="OLD UNUSED NOTES" />
                <CaptionSvgText x="36" y="38" fill="#E8E9F8" text="ARE" />
                <CaptionSvgText x="71" y="38" fill="#96FFFF" text="SMALL" />
              </CaptionSvgTextBox>
              <ArrowDown src={arrow} />
            </Hint>
            <Figure>
            <Img src={imageMindmap} className='shadow' />
              <CaptionSvgTextBox viewBoxWidth="100" viewBoxHeight="21" left="34%" top="21%" width="15.5%" fontWeight="700">
                <CaptionSvgText x="6" y="18" fill="#131C3E" text="NeuralNotes" />
              </CaptionSvgTextBox>
              <CaptionSvgTextBox viewBoxWidth="45" left="52.5%" top="48%" width="9.5%" fontWeight="700">
                <CaptionSvgText y="16" text="Work" />
              </CaptionSvgTextBox>
              <CaptionSvgTextBox left="19.5%" top="51%" width="13.5%" fontWeight="700">
                <CaptionSvgText y="16" text="Current" />
                <CaptionSvgText y="32" text="Project" />
              </CaptionSvgTextBox>
              <CaptionSvgTextBox left="14.5%" top="26%" width="7.5%">
                <CaptionSvgText y="14" text="Personal" />
                <CaptionSvgText x="20" y="32" text="life" />
              </CaptionSvgTextBox>
              <CaptionSvgTextBox left="61%" top="25.5%" width="7.5%">
                <CaptionSvgText x="12" y="14" text="Old" />
                <CaptionSvgText y="32" text="project" />
              </CaptionSvgTextBox>
              <CaptionSvgTextBox viewBoxWidth="70" left="81%" top="35%" width="8%">
                <CaptionSvgText y="14" text="Forgotten" />
                <CaptionSvgText x="10" y="32" text="project" />
              </CaptionSvgTextBox>
              <CaptionSvgTextBox viewBoxWidth="82" left="79%" top="60%" width="10%">
                <CaptionSvgText y="14" text="Abandoned" />
                <CaptionSvgText x="17" y="32" text="project" />
              </CaptionSvgTextBox>
            </Figure>
          <Hint className='hint-recent-notes'>
            <ArrowUp src={arrow} />
            <CaptionSvgTextBox viewBoxWidth="170" viewBoxHeight="40" left="7%" top="35%" width="86%" fontWeight="700">
              <CaptionSvgText x="3" y="18" fill="#E8E9F8" text="RECENT, FREQUENTLY" />
              <CaptionSvgText x="3" y="38" fill="#E8E9F8" text="USED NOTES ARE" />
              <CaptionSvgText x="137" y="38" fill="#96FFFF" text="BIG" />
            </CaptionSvgTextBox>
          </Hint>
        </Slide>
      );
    }
};
