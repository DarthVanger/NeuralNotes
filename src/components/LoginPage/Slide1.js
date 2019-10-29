import React, { Component } from 'react';
import styled from 'styled-components';
import slideImage from 'components/LoginPage/images/slide-1.svg';

const Slide = styled.section`
  padding-bottom: 10%;
  text-align: center;
  Img {
    width: 74%;
  }
`;
const AppName = styled.header`
  display: block;
  text-align: center;
  color: #ffffff;
  padding-top: 10%;
  padding-bottom: 7%;
  h1 {
    font-weight: 100;
    font-size: calc(24px + (45 - 24)*(100vw - 375px)/(1200 - 375));
    b {
        color: #96ffff;
      }
  }
`;
const Figure = styled.figure`
  width: 100%;
  height: auto;
`;
const Img = styled.img`
  width: 100%;
  height: auto;
`;


export default class Slide1 extends Component {
    render() {
        return (
            <Slide>
                <AppName>
                    <h1><b>Neural</b>Notes</h1>
                </AppName>
                <Figure>
                    <Img src={slideImage} />
                </Figure>
            </Slide>
        );
    }
};