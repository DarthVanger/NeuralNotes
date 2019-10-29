import React, { Component } from 'react';
import styled from 'styled-components';
import slideImage from 'components/LoginPage/images/slide-2.svg';

const Slide = styled.section`
  padding-bottom: 10%;
  text-align: center;
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
const Caption = styled.div`
  font-weight: ${props => props.font || 300};
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
  font-weight: ${props => props.font};
`;

const CaptionSvgTextBox = ({width = 60, height = 15, ...rest}) => {
  return <svg viewBox={`0 0 ${width} ${height}`} {...rest} />;
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
              <Img src={slideImage} />
              <Caption left="14.5%" right="76%" bottom="84.5%">
                <CaptionSvgTextBox>
                  <CaptionSvgText text="Chill"/>
                </CaptionSvgTextBox>
              </Caption>
              <Caption left="4.5%" right="86%" bottom="60%">
                <CaptionSvgTextBox>
                  <CaptionSvgText text="Rock"/>
                </CaptionSvgTextBox>
              </Caption>
              <Caption left="4.5%" right="85%" bottom="24.5%">
                <CaptionSvgTextBox>
                  <CaptionSvgText text="Art"/>
                </CaptionSvgTextBox>
              </Caption>
              <Caption left="46.5%" right="44%" bottom="7.5%">
                <CaptionSvgTextBox>
                  <CaptionSvgText text="Quotes"/>
                </CaptionSvgTextBox>
              </Caption>
              <Caption left="50%" right="41%" bottom="85%">
                <CaptionSvgTextBox height="36">
                  <CaptionSvgText text="Berlin"/>
                  <CaptionSvgText x="2" y="32" text="2019"/>
                </CaptionSvgTextBox>
              </Caption>
              <Caption left="88.5%" right="2.5%" bottom="78.5%">
                <CaptionSvgTextBox height="36">
                  <CaptionSvgText text="Japan"/>
                  <CaptionSvgText x="5" y="32" text="2018"/>
                </CaptionSvgTextBox>
              </Caption>
              <Caption left="87%" right="4%" bottom="41%">
                <CaptionSvgTextBox>
                  <CaptionSvgText text="Keep fit"/>
                </CaptionSvgTextBox>
              </Caption>
              <Caption left="83.5%" right="7%" bottom="10.5%">
                <CaptionSvgTextBox height="36">
                  <CaptionSvgText x="5" text="Visit"/>
                  <CaptionSvgText y="32" text="Africa"/>
                </CaptionSvgTextBox>
              </Caption>
              <Caption left="26.5%" right="63%" bottom="63.5%">
                <CaptionSvgTextBox>
                  <CaptionSvgText text="Music"/>
                </CaptionSvgTextBox>
              </Caption>
              <Caption left="21%" right="65%" bottom="20%">
                <CaptionSvgTextBox width="80" height="20">
                  <CaptionSvgText text="Inspiration"/>
                </CaptionSvgTextBox>
              </Caption>
              <Caption left="67.25%" right="22.25%" bottom="71%">
                <CaptionSvgTextBox>
                  <CaptionSvgText text="Travel"/>
                </CaptionSvgTextBox>
              </Caption>
              <Caption left="65.5%" right="24%" bottom="36%">
                <CaptionSvgTextBox>
                  <CaptionSvgText text="Dreams"/>
                </CaptionSvgTextBox>
              </Caption>
              <Caption left="40.75%" right="39.5%" bottom="52%" font="700">
                <CaptionSvgTextBox width="100" height="21">
                  <CaptionSvgText x="6" y="18" fill="#131C3E" text="NeuralNotes"/>
                </CaptionSvgTextBox>
              </Caption>
            </Figure>
          </Slide>
        );
    }
};