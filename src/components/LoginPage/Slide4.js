import React, { Component } from 'react';

import styled from 'styled-components';

import COLORS from 'components/LoginPage/colors';
import imageCloudScreenshot from 'components/LoginPage/images/slide-4-cloud-screenshot.svg';
import imageMindmap from 'components/LoginPage/images/slide-4-mindmap.svg';
import { Img, Caption } from 'components/LoginPage/slideComponents';

const Slide = styled.section`
  padding-bottom: 10%;
  text-align: center;
  position: relative;

  .mind-map {
    position: absolute;
    width: 60%;
    right: 0%;
    top: 3%;
    z-index: 1;
  }

  .cloud-screenshot {
    width: 100%;
    margin-left: -24%;
  }
`;

const Figure = styled.figure`
  position: relative;
  width: 74%;
  margin: auto;
  height: auto;
`;

const CaptionTextSlide4 = ({ x = 0, y = 12, fill = COLORS.aqua, text }) => {
  return (
    <text x={x} y={y} fill={fill}>
      {text}
    </text>
  );
};

const CaptionBoxSlide4 = ({
  viewBoxWidth = 36,
  viewBoxHeight = 22,
  ...rest
}) => {
  return <Caption viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} {...rest} />;
};

export default class Slide4 extends Component {
  render() {
    return (
      <Slide>
        <Figure className="mind-map">
          <Img src={imageMindmap} shadow />
          <CaptionBoxSlide4 left="69%" top="11%" width="7.5%">
            <CaptionTextSlide4 x="2" y="16" text="Chill" />
          </CaptionBoxSlide4>
          <CaptionBoxSlide4
            viewBoxWidth="38"
            left="31%"
            top="41.5%"
            width="7.5%">
            <CaptionTextSlide4 x="2" y="16" text="Rock" />
          </CaptionBoxSlide4>
          <CaptionBoxSlide4
            viewBoxWidth="44"
            viewBoxHeight="36"
            left="20.5%"
            top="74%"
            width="8.5%">
            <CaptionTextSlide4 x="5" y="14" text="Visit" />
            <CaptionTextSlide4 y="32" text="Africa" />
          </CaptionBoxSlide4>
          <CaptionBoxSlide4
            viewBoxWidth="60"
            viewBoxHeight="15"
            left="61%"
            top="81%"
            width="11.5%">
            <CaptionTextSlide4 text="Keep fit" />
          </CaptionBoxSlide4>
          <CaptionBoxSlide4
            left="73.5%"
            top="63%"
            width="8.5%"
            fontWeight="700">
            <CaptionTextSlide4 text="Art" />
          </CaptionBoxSlide4>
          <CaptionBoxSlide4
            viewBoxWidth="45"
            left="36%"
            top="23.5%"
            width="10.5%"
            fontWeight="700">
            <CaptionTextSlide4 y="16" text="Music" />
          </CaptionBoxSlide4>
          <CaptionBoxSlide4
            viewBoxWidth="58"
            left="32.5%"
            top="57.5%"
            width="13.5%"
            fontWeight="700">
            <CaptionTextSlide4 text="Dreams" />
          </CaptionBoxSlide4>
          <CaptionBoxSlide4
            viewBoxWidth="45"
            left="76%"
            top="36.5%"
            width="9.5%"
            fontWeight="700">
            <CaptionTextSlide4 y="16" text="Work" />
          </CaptionBoxSlide4>
          <CaptionBoxSlide4
            viewBoxWidth="100"
            viewBoxHeight="21"
            left="52.5%"
            top="48%"
            width="18.5%"
            fontWeight="700">
            <CaptionTextSlide4
              x="6"
              y="18"
              fill={COLORS.rainfull}
              text="NeuralNotes"
            />
          </CaptionBoxSlide4>
        </Figure>
        <Figure className="cloud-screenshot">
          <Img src={imageCloudScreenshot} shadow />
        </Figure>
      </Slide>
    );
  }
}
