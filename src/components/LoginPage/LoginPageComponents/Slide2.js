import React, { Component } from 'react';
import styled from 'styled-components';
import slideImage from 'components/LoginPage/images/slide-2.svg';

const Slide = styled.section`
  padding-bottom: 10%;
  text-align: center;
  Img {
    width: 74%;
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
  width: 100%;
  height: auto;
`;
const Img = styled.img`
  width: 100%;
  height: auto;
`;
const CaptionsConteiner = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 13%;
  right: 13%;
  padding: 0;
  color: #ffffff;
  text-align: center;
`;
const Caption = styled.div`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
  font-weight: ${props => props.font};
`;


export default class Slide2 extends Component {
    render() {
        return (
          <Slide>
            <H3><b>Create Notes</b>
              <br />
              As A Mind Map</H3>
            <Figure>
              <Img src={slideImage} />
              <CaptionsConteiner>
                <Caption left="14.5%" right="76%" bottom="84.5%" font="300">
                  <svg viewBox="0 0 60 15">
                    <text x="0" y="12" fill="#96FFFF">Chill</text>
                  </svg>
                </Caption>
                <Caption left="4.5%" right="86%" bottom="60%" font="300">
                  <svg viewBox="0 0 60 15">
                    <text x="0" y="12" fill="#96FFFF">Rock</text>
                  </svg>
                </Caption>
                <Caption left="4.5%" right="85%" bottom="24.5%" font="300">
                  <svg viewBox="0 0 60 15">
                    <text x="0" y="12" fill="#96FFFF">Art</text>
                  </svg>
                </Caption>
                <Caption left="46.5%" right="44%" bottom="7.5%" font="300">
                  <svg viewBox="0 0 60 15">
                    <text x="0" y="12" fill="#96FFFF">Quotes</text>
                  </svg>
                </Caption>
                <Caption left="50%" right="41%" bottom="85%" font="300">
                  <svg viewBox="0 0 60 36">
                    <text x="0" y="12" fill="#96FFFF">Berlin</text>
                    <text x="2" y="32" fill="#96FFFF">2019</text>
                  </svg>
                </Caption>
                <Caption left="88.5%" right="2.5%" bottom="78.5%" font="300">
                  <svg viewBox="0 0 60 36">
                    <text x="0" y="12" fill="#96FFFF">Japan</text>
                    <text x="5" y="32" fill="#96FFFF">2018</text>
                  </svg>
                </Caption>
                <Caption left="87%" right="4%" bottom="41%" font="300">
                  <svg viewBox="0 0 60 15">
                    <text x="0" y="12" fill="#96FFFF">Keep fit</text>
                  </svg>
                </Caption>
                <Caption left="83.5%" right="7%" bottom="10.5%" font="300">
                  <svg viewBox="0 0 60 36">
                    <text x="5" y="12" fill="#96FFFF">Visit</text>
                    <text x="0" y="32" fill="#96FFFF">Africa</text>
                  </svg>
                </Caption>
                <Caption left="26.5%" right="63%" bottom="63.5%" font="300">
                  <svg viewBox="0 0 60 15">
                    <text x="0" y="12" fill="#96FFFF">Music</text>
                  </svg>
                </Caption>
                <Caption left="21%" right="65%" bottom="20%" font="300">
                  <svg viewBox="0 0 80 20">
                    <text x="0" y="12" fill="#96FFFF">Inspiration</text>
                  </svg>
                </Caption>
                <Caption left="67.25%" right="22.25%" bottom="71%" font="300">
                  <svg viewBox="0 0 60 15">
                    <text x="0" y="12" fill="#96FFFF">Travel</text>
                  </svg>
                </Caption>
                <Caption left="65.5%" right="24%" bottom="36%" font="300">
                  <svg viewBox="0 0 60 15">
                    <text x="0" y="12" fill="#96FFFF">Dreams</text>
                  </svg>
                </Caption>
                <Caption left="40.75%" right="39.5%" bottom="52%" font="700">
                  <svg viewBox="0 0 100 21">
                    <text x="6" y="18" fill="#131C3E">NeuralNotes</text>
                  </svg>
                </Caption>
              </CaptionsConteiner>
            </Figure>
          </Slide>
        );
    }
};