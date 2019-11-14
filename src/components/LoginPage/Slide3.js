import React, { Component } from 'react';
import styled from 'styled-components';
import arrow from 'components/LoginPage/images/arrow.svg'
import slideImage1 from 'components/LoginPage/images/slide-3_img-1.svg';
import slideImage2 from 'components/LoginPage/images/slide-3_img-2.svg';

const Slide = styled.div`
  padding-bottom: 0%;
  text-align: center;
  .note-example {
    width: 61%;
  }
   .edit-example {
    position: relative;
    margin-top: -9%;
  }
  .bottomPosition {
    margin-top: -16%;
    margin-bottom: 10%;
    position: relative;
  }
  .bottomTooltip {
    width: 22%;
    padding-top: 3%;
    padding-bottom: 3%;
  }
`;
const H2 = styled.h2`
  padding-bottom: 7%;
  font-size: calc(16px + (30 - 16)*(100vw - 375px)/(1200 - 375));
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
const ArrowUp = styled.img`
  width: 2%;
  height: auto;
`;
const ArrowDown = styled.img`
  width: 2%;
  height: auto;
  transform: rotate(180deg);
`;
const ArrowLeft = styled.img`
  width: 1.5%;
  height: auto;
  transform: rotate(270deg);
  position: absolute;
  left: 36%;
  top: 38%;
`;
const ArrowRight = styled.img`
  width: 1.5%;
  height: auto;
  transform: rotate(90deg);
  position: absolute;
  right: 36%;
  top: 38%;
`;
const Tooltip = styled.div`
  position: relative;
  width: 34%;
  background: #0E1736;
  border-radius: 5px;
  box-shadow: inset 0px 4px 2px rgba(0, 0, 0, 0.25);
  padding-left: 2.7%;
  padding-right: 2.7%;
  padding-top: 4%;
  padding-bottom: 4%;
  color: #E8E9F8;
  text-transform: uppercase;
  font-weight: 700;
  margin-top: 1vw;
  margin-bottom: 1vw;
  margin-left: auto;
  margin-right: auto;
`;

const Caption = styled.svg`
  font-weight: ${props => props.fontWeight || 700};
  position: absolute;
  width: ${props => props.width};
  top: ${props => props.top};
  left: ${props => props.left};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
`;

const CaptionSvgTextBox = ({viewBoxWidth = 100, viewBoxHeight = 21, ...rest}) => {
  return <Caption viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} {...rest} />;
};
const CaptionSvgText = ({x = 0, y = 15, fill = "#FFFFFF", text}) => {
  return <text x={x} y={y} fill={fill}>{text}</text>;
};


export default class Slide3 extends Component {
    render() {
        return (
            <Slide>
            <H2><b>Edit Notes Content</b>
              <br />
              And Attach Files
            </H2>
            <Figure>
              <Img className='note-example' src={slideImage1} />
            </Figure>
            <Figure>
              <ArrowUp src={arrow} />
              <Tooltip>
                <CaptionSvgTextBox viewBoxWidth="155" viewBoxHeight="19" left="12%" top="27%" width="76%">
                  <CaptionSvgText y="17" text="Edit Note Content"/>
                </CaptionSvgTextBox>
              </Tooltip>
              <ArrowDown src={arrow} />
            </Figure>
            <Figure className='edit-example'>
              <Img src={slideImage2} />
                <CaptionSvgTextBox  left="78%" top="11.5%" width="15%">
                  <CaptionSvgText fill="#96ffff" text="Neural"/>
                  <CaptionSvgText x="47" text="Notes"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox viewBoxWidth="80" viewBoxHeight="40" left="43%" top="36%" width="14%">
                  <CaptionSvgText y="14" text="VACATION"/>
                  <CaptionSvgText x="22" y="34" text="2018"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox viewBoxWidth="90" viewBoxHeight="44" left="12%" top="61%" width="12%">
                  <CaptionSvgText x="22" y="14" text="Hotel"/>
                  <CaptionSvgText y="34" text="Booking.pdf"/>
                </CaptionSvgTextBox>
              <CaptionSvgTextBox viewBoxWidth="72" viewBoxHeight="44"  left="76.5%" top="61%" width="10%">
                  <CaptionSvgText x="4" y="14" text="Airplane"/>
                  <CaptionSvgText y="34" text="ticket.pdf"/>
                </CaptionSvgTextBox>
            </Figure>
            <div className='bottomPosition'>
              <ArrowLeft src={arrow} />
              <Tooltip className='bottomTooltip'>
                <CaptionSvgTextBox viewBoxWidth="108" viewBoxHeight="19" left="20%" top="30%" width="60%">
                  <CaptionSvgText x="1" y="15" text="Attach files"/>
                </CaptionSvgTextBox>
                </Tooltip>
              <ArrowRight src={arrow} />
            </div>
          </Slide>
        );
    }
};
