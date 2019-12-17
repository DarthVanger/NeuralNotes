import React, { Component } from 'react';
import styled from 'styled-components';
import arrow from 'components/LoginPage/images/arrow.svg'
import imageNoteContent from 'components/LoginPage/images/slide-3-note-content.svg';
import imageMindmapExplanation from 'components/LoginPage/images/slide-3-mindmap-explanation.svg';
import { Img, Caption } from 'components/LoginPage/slideComponents';
import COLORS from 'components/LoginPage/colors';

const Slide = styled.section`
  padding-bottom: 0%;
  text-align: center;
  .note-example {
    width: 61%;
  }
   .edit-example {
    position: relative;
    margin-top: -9%;
  }
  .container-for-hint {
    margin-top: -65%;
    margin-bottom: 59%;
    position: relative;
  }
  .hint-attach-files {
    width: 22%;
    padding-top: 3%;
    padding-bottom: 3%;
  }
  .subheader {
    margin-top: -53%;
    margin-bottom: 45%;
    position: relative;
  }
`;
const H2 = styled.h2`
  padding-bottom: 7%;
  font-size: calc(16px + (30 - 16)*(100vw - 375px)/(1200 - 375));
  text-align: center;
  color: ${COLORS.white};
`;
const H3 = styled.h3`
  padding-bottom: 7%;
  text-align: center;
  color: ${COLORS.white};
`;
const Figure = styled.figure`
  position: relative;
  width: 74%;
  margin: auto;
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
const Hint = styled.div`
  position: relative;
  width: 34%;
  background: ${COLORS.denim};
  border-radius: 5px;
  box-shadow: inset 0px 4px 2px rgba(0, 0, 0, 0.25);
  padding-left: 2.7%;
  padding-right: 2.7%;
  padding-top: 4%;
  padding-bottom: 4%;
  color: ${COLORS.pearl};
  text-transform: uppercase;
  font-weight: 700;
  margin-top: 1vw;
  margin-bottom: 1vw;
  margin-left: auto;
  margin-right: auto;
`;

const CaptionTextSlide3 = ({x = 0, y = 15, fill = COLORS.white, fontWeight = 700, text}) => {
  return <text x={x} y={y} fill={fill} font-weight={fontWeight}>{text}</text>;
};

const CaptionBoxSlide3 = ({viewBoxWidth = 100, viewBoxHeight = 21, ...rest}) => {
  return <Caption viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} {...rest} />;
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
              <Img className='note-example' src={imageNoteContent} shadow />
            </Figure>
            <Figure>
              <ArrowUp src={arrow} />
              <Hint>
                <CaptionBoxSlide3 viewBoxWidth="155" viewBoxHeight="19" left="12%" top="27%" width="76%">
                  <CaptionTextSlide3 y="17" text="Edit Note Content"/>
                </CaptionBoxSlide3>
              </Hint>
              <ArrowDown src={arrow} />
            </Figure>
            <Figure className='edit-example'>
              <Img src={imageMindmapExplanation} shadow />
                <CaptionBoxSlide3  left="78.5%" top="5%" width="15%">
                <CaptionTextSlide3 fill={COLORS.aqua} text="Neural"/>
                <CaptionTextSlide3 x="47" text="Notes"/>
                </CaptionBoxSlide3>
              <CaptionBoxSlide3 viewBoxWidth="80" viewBoxHeight="40" left="43.5%" top="16.5%" width="14%">
                  <CaptionTextSlide3 y="14" text="VACATION"/>
                  <CaptionTextSlide3 x="22" y="34" text="2018"/>
              </CaptionBoxSlide3>
              <CaptionBoxSlide3 viewBoxWidth="90" viewBoxHeight="44" left="12%" top="28.5%" width="12%">
                <CaptionTextSlide3 x="22" y="14" text="Hotel"/>
                  <CaptionTextSlide3 y="34" text="Booking.pdf"/>
                </CaptionBoxSlide3>
              <CaptionBoxSlide3 viewBoxWidth="72" viewBoxHeight="44" left="77%" top="28.5%" width="10%">
                <CaptionTextSlide3 x="4" y="14" text="Airplane"/>
                <CaptionTextSlide3 y="34" text="ticket.pdf"/>
              </CaptionBoxSlide3>
            </Figure>
            <div className='container-for-hint'>
              <ArrowLeft src={arrow} />
              <Hint className='hint-attach-files'>
                <CaptionBoxSlide3 viewBoxWidth="108" viewBoxHeight="19" left="20%" top="30%" width="60%">
                  <CaptionTextSlide3 x="1" y="15" text="Attach files"/>
                </CaptionBoxSlide3>
              </Hint>
              <ArrowRight src={arrow} />
            </div>
            <div className='subheader'>
             <H3>
                <CaptionBoxSlide3 viewBoxWidth="315" viewBoxHeight="56" left="35%" top="5%" width="30%">
                  <CaptionTextSlide3 x="0" y="20" fontWeight="300" text="All notes and files are stored" />
                  <CaptionTextSlide3 x="42" y="48" text="in your Google Drive" />
                </CaptionBoxSlide3>
              </H3>
            </div>
          </Slide>
        );
    }
};
