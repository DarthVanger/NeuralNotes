import React, { Component } from 'react';
import styled from 'styled-components';
import imageMindmap from 'components/LoginPage/images/slide-4-mindmap.svg';
import imageCloudScreenshot from 'components/LoginPage/images/slide-4-cloud-screenshot.svg';
import {Img} from 'components/LoginPage/slideComponents';

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
const Caption = styled.svg`
  font-weight: ${props => props.fontWeight || 300};
  position: absolute;
  width: ${props => props.width};
  top: ${props => props.top};
  left: ${props => props.left};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
`;

const CaptionSvgTextBox = ({ viewBoxWidth = 36, viewBoxHeight = 22, ...rest }) => {
    return <Caption viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} {...rest} />;
};
const CaptionSvgText = ({ x = 0, y = 12, fill = "#96FFFF", text }) => {
    return <text x={x} y={y} fill={fill}>{text}</text>;
};

export default class Slide4 extends Component {
    render() {
        return (
            <Slide>
                <Figure className='mind-map'>
                    <Img src={imageMindmap} shadow />
                    <CaptionSvgTextBox left="69%" top="11%" width="7.5%">
                        <CaptionSvgText x="2" y="16" text="Chill" />
                    </CaptionSvgTextBox>
                    <CaptionSvgTextBox viewBoxWidth="38" left="31%" top="41.5%" width="7.5%">
                        <CaptionSvgText x="2" y="16" text="Rock" />
                    </CaptionSvgTextBox>
                    <CaptionSvgTextBox viewBoxWidth="44" viewBoxHeight="36" left="20.5%" top="74%" width="8.5%">
                        <CaptionSvgText x="5" y="14" text="Visit" />
                        <CaptionSvgText y="32" text="Africa" />
                    </CaptionSvgTextBox>
                    <CaptionSvgTextBox viewBoxWidth="60" viewBoxHeight="15" left="61%" top="81%" width="11.5%">
                        <CaptionSvgText text="Keep fit"/>
                    </CaptionSvgTextBox>
                    <CaptionSvgTextBox left="73.5%" top="63%" width="8.5%" fontWeight="700">
                        <CaptionSvgText text="Art"/>
                    </CaptionSvgTextBox>
                    <CaptionSvgTextBox viewBoxWidth="45" left="36%" top="23.5%" width="10.5%" fontWeight="700">
                        <CaptionSvgText y="16" text="Music"/>
                    </CaptionSvgTextBox>
                    <CaptionSvgTextBox viewBoxWidth="58" left="32.5%" top="57.5%" width="13.5%" fontWeight="700">
                        <CaptionSvgText text="Dreams"/>
                    </CaptionSvgTextBox>
                    <CaptionSvgTextBox viewBoxWidth="45" left="76%" top="36.5%" width="9.5%" fontWeight="700">
                        <CaptionSvgText y="16" text="Work" />
                    </CaptionSvgTextBox>
                    <CaptionSvgTextBox viewBoxWidth="100" viewBoxHeight="21" left="52.5%" top="48%" width="18.5%" fontWeight="700">
                        <CaptionSvgText x="6" y="18" fill="#131C3E" text="NeuralNotes"/>
                    </CaptionSvgTextBox>
                </Figure>
                <Figure className='cloud-screenshot'>
                    <Img src={imageCloudScreenshot} shadow />
                </Figure>
            </Slide>
        );
    }
};