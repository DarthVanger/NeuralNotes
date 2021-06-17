import React, { Component } from 'react';

import styled from 'styled-components';

import COLORS from 'components/LoginPage/colors';
import imageBrain from 'components/LoginPage/images/slide-1-brain.svg';
import { Img } from 'components/LoginPage/slideComponents';
import { FONT_SIZE } from 'components/LoginPage/slideComponents';

const Slide = styled.section`
  padding-bottom: 10%;
  text-align: center;

  img {
    width: 84%;
  }
`;

const AppName = styled.header`
  text-align: center;
  color: ${COLORS.white};
  padding-top: 10%;
  padding-bottom: 7%;
`;

const H1 = styled.h1`
  font-weight: 100;
  font-size: ${FONT_SIZE.H1};

  b {
    color: ${COLORS.aqua};
  }
`;

const Figure = styled.figure`
  width: 100%;
  height: auto;
`;

export default class Slide1 extends Component {
  render() {
    return (
      <Slide>
        <AppName>
          <H1>[ The app is still under construction! ]</H1>
          <H1>
            <b>Neural</b>Notes
          </H1>
        </AppName>
        <Figure>
          <Img src={imageBrain} shadow />
        </Figure>
      </Slide>
    );
  }
}
