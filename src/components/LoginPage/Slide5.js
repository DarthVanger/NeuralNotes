import React, { Component } from 'react';

import styled from 'styled-components';

import COLORS from 'components/LoginPage/colors';
import arrow from 'components/LoginPage/images/arrow.svg';
import imageMindmap from 'components/LoginPage/images/slide-5-mindmap.svg';
import { Img, Caption } from 'components/LoginPage/slideComponents';
import { FONT_SIZE } from 'components/LoginPage/slideComponents';

const Slide = styled.section`
  position: relative;

  .hint-old-notes {
    position: absolute;
    right: 5%;
    width: 24%;
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

const H2 = styled.h2`
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  font-size: ${FONT_SIZE.H2};
  text-align: center;
  color: ${COLORS.white};
`;

const Figure = styled.figure`
  width: 100%;
  height: auto;
  position: relative;
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
  background: ${COLORS.denim};
  border-radius: 1vw;
  box-shadow: inset 0px 4px 2px rgba(0, 0, 0, 0.25);
`;

const CaptionTextSlide5 = ({ x = 0, y, fill = COLORS.aqua, text }) => {
  return (
    <text x={x} y={y} fill={fill}>
      {text}
    </text>
  );
};

const CaptionBoxSlide5 = ({
  viewBoxWidth = 60,
  viewBoxHeight = 40,
  ...rest
}) => {
  return <Caption viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} {...rest} />;
};

export default class Slide5 extends Component {
  render() {
    return (
      <Slide>
        <H2>
          Frequently used notes
          <br />
          get bigger
        </H2>
        <Hint className="hint-old-notes">
          <CaptionBoxSlide5
            viewBoxWidth="160"
            viewBoxHeight="40"
            left="7%"
            top="10%"
            width="86%"
            fontWeight="700">
            <CaptionTextSlide5
              x="6"
              y="18"
              fill={COLORS.pearl}
              text="OLD UNUSED NOTES"
            />
            <CaptionTextSlide5 x="36" y="38" fill={COLORS.pearl} text="ARE" />
            <CaptionTextSlide5 x="71" y="38" text="SMALL" />
          </CaptionBoxSlide5>
          <ArrowDown src={arrow} />
        </Hint>
        <Figure>
          <Img src={imageMindmap} shadow />
          <CaptionBoxSlide5
            viewBoxWidth="100"
            viewBoxHeight="21"
            left="34%"
            top="21%"
            width="15.5%"
            fontWeight="700">
            <CaptionTextSlide5
              x="6"
              y="18"
              fill={COLORS.rainfull}
              text="NeuralNotes"
            />
          </CaptionBoxSlide5>
          <CaptionBoxSlide5
            viewBoxWidth="45"
            left="52.5%"
            top="48%"
            width="9.5%"
            fontWeight="700">
            <CaptionTextSlide5 y="16" text="Work" />
          </CaptionBoxSlide5>
          <CaptionBoxSlide5
            left="19.5%"
            top="51%"
            width="13.5%"
            fontWeight="700">
            <CaptionTextSlide5 y="16" text="Current" />
            <CaptionTextSlide5 y="32" text="Project" />
          </CaptionBoxSlide5>
          <CaptionBoxSlide5 left="14.5%" top="26%" width="7.5%">
            <CaptionTextSlide5 y="14" text="Personal" />
            <CaptionTextSlide5 x="20" y="32" text="life" />
          </CaptionBoxSlide5>
          <CaptionBoxSlide5 left="61%" top="25.5%" width="7.5%">
            <CaptionTextSlide5 x="12" y="14" text="Old" />
            <CaptionTextSlide5 y="32" text="project" />
          </CaptionBoxSlide5>
          <CaptionBoxSlide5 viewBoxWidth="70" left="81%" top="35%" width="8%">
            <CaptionTextSlide5 y="14" text="Forgotten" />
            <CaptionTextSlide5 x="10" y="32" text="project" />
          </CaptionBoxSlide5>
          <CaptionBoxSlide5 viewBoxWidth="82" left="79%" top="60%" width="10%">
            <CaptionTextSlide5 y="14" text="Abandoned" />
            <CaptionTextSlide5 x="17" y="32" text="project" />
          </CaptionBoxSlide5>
        </Figure>
        <Hint className="hint-recent-notes">
          <ArrowUp src={arrow} />
          <CaptionBoxSlide5
            viewBoxWidth="170"
            viewBoxHeight="40"
            left="7%"
            top="35%"
            width="86%"
            fontWeight="700">
            <CaptionTextSlide5
              x="3"
              y="18"
              fill={COLORS.pearl}
              text="RECENT, FREQUENTLY"
            />
            <CaptionTextSlide5
              x="3"
              y="38"
              fill={COLORS.pearl}
              text="USED NOTES ARE"
            />
            <CaptionTextSlide5 x="137" y="38" text="BIG" />
          </CaptionBoxSlide5>
        </Hint>
      </Slide>
    );
  }
}
