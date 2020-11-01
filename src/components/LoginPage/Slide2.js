import React, { Component } from 'react';

import styled from 'styled-components';

import COLORS from 'components/LoginPage/colors';
import imageMindmap from 'components/LoginPage/images/slide-2-mindmap.svg';
import { Img, Caption } from 'components/LoginPage/slideComponents';
import { FONT_SIZE } from 'components/LoginPage/slideComponents';

const Slide = styled.section`
  padding-bottom: 10%;
  text-align: center;
`;

const H2 = styled.h2`
  padding-bottom: 7%;
  font-size: ${FONT_SIZE.H2};
  text-align: center;
  color: ${COLORS.white};
`;

const Figure = styled.figure`
  position: relative;
  width: 90%;
  margin: auto;
  height: auto;
`;

const CaptionTextSlide2 = ({
  x = 0,
  y = 12,
  fill = COLORS.aqua,
  fontWeight,
  text,
}) => {
  return (
    <text x={x} y={y} fill={fill} fontWeight={fontWeight}>
      {text}
    </text>
  );
};

const CaptionBoxSlide2 = ({
  viewBoxWidth = 60,
  viewBoxHeight = 15,
  width = '9.5%',
  ...rest
}) => {
  return (
    <Caption
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={width}
      {...rest}
    />
  );
};

export default class Slide2 extends Component {
  render() {
    return (
      <Slide>
        <H2>
          <b>Create Notes</b>
          <br />
          As A Mind Map
        </H2>
        <Figure>
          <Img src={imageMindmap} shadow />
          <CaptionBoxSlide2 left="14.5%" top="11%">
            <CaptionTextSlide2 text="Chill" />
          </CaptionBoxSlide2>
          <CaptionBoxSlide2 left="4.5%" top="35%">
            <CaptionTextSlide2 text="Rock" />
          </CaptionBoxSlide2>
          <CaptionBoxSlide2 left="4.5%" top="71%">
            <CaptionTextSlide2 text="Art" />
          </CaptionBoxSlide2>
          <CaptionBoxSlide2 left="46.5%" top="88%">
            <CaptionTextSlide2 text="Quotes" />
          </CaptionBoxSlide2>
          <CaptionBoxSlide2 viewBoxHeight="36" left="50%" top="6%">
            <CaptionTextSlide2 text="Berlin" />
            <CaptionTextSlide2 x="2" y="32" text="2019" />
          </CaptionBoxSlide2>
          <CaptionBoxSlide2 viewBoxHeight="36" left="88.5%" top="12%">
            <CaptionTextSlide2 text="Japan" />
            <CaptionTextSlide2 x="5" y="32" text="2018" />
          </CaptionBoxSlide2>
          <CaptionBoxSlide2 left="87%" top="54%">
            <CaptionTextSlide2 text="Keep fit" />
          </CaptionBoxSlide2>
          <CaptionBoxSlide2 viewBoxHeight="36" left="83.5%" top="80%">
            <CaptionTextSlide2 x="5" text="Visit" />
            <CaptionTextSlide2 y="32" text="Africa" />
          </CaptionBoxSlide2>
          <CaptionBoxSlide2 left="26.5%" top="31.5%" width="10.5%">
            <CaptionTextSlide2 text="Music" />
          </CaptionBoxSlide2>
          <CaptionBoxSlide2
            viewBoxWidth="80"
            viewBoxHeight="20"
            left="21%"
            top="73.5%"
            width="14%">
            <CaptionTextSlide2 text="Inspiration" />
          </CaptionBoxSlide2>
          <CaptionBoxSlide2 left="67.25%" top="25%" width="10.5%">
            <CaptionTextSlide2 text="Travel" />
          </CaptionBoxSlide2>
          <CaptionBoxSlide2 left="66%" top="58.5%" width="10.5%">
            <CaptionTextSlide2 text="Dreams" />
          </CaptionBoxSlide2>
          <CaptionBoxSlide2
            viewBoxWidth="100"
            viewBoxHeight="21"
            left="41.5%"
            top="41%"
            width="18.5%"
            fontWeight="700">
            <CaptionTextSlide2
              x="6"
              y="18"
              fill={COLORS.rainfull}
              text="NeuralNotes"
            />
          </CaptionBoxSlide2>
        </Figure>
      </Slide>
    );
  }
}
