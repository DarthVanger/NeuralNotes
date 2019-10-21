import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Slide1 from 'components/LoginPage/LoginPageComponents/Slide1';
import Slide2 from 'components/LoginPage/LoginPageComponents/Slide2';
import slide3img1 from 'components/LoginPage/images/slide-3_img-1.svg';
import slide3img2 from 'components/LoginPage/images/slide-3_img-2.svg';
import arrow from 'components/LoginPage/images/arrow.svg'
import slide4 from 'components/LoginPage/images/slide-4.svg';
import arrowCurve from 'components/LoginPage/images/arrow-curve.svg';
import slide5img1 from 'components/LoginPage/images/slide-5_img-1.svg';
import slide5img2 from 'components/LoginPage/images/slide-5_img-2.svg';
import slide6 from 'components/LoginPage/images/slide-6.svg';
import iconGoogle from 'components/LoginPage/images/icon-google.svg';

const Main = styled.main`
  width: 100%;
  background-color: #131c3e;
  font-family: Roboto;
`;

const Section = styled.section`
  width: 100%;
  max-width: calc(100vh*1.1);
  margin: auto;
`;

const Figure = styled.figure`
  width: 100%;
  height: auto;
`;

const Img = styled.img`
  width: 100%;
  height: auto;
`;

const H3 = styled.h3`
  padding-bottom: 7%;
  font-size: calc(13px + (24 - 13)*(100vw - 375px)/(1200 - 375));
  text-align: center;
  color: #ffffff;
`;

const H2 = styled.h2`
  padding-bottom: 7%;
  font-size: calc(16px + (30 - 16)*(100vw - 375px)/(1200 - 375));
  text-align: center;
  color: #ffffff;
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
  width: 2%;
  height: auto;
  transform: rotate(270deg);
  position: absolute;
  left: 31%;
  top: 36%;
`;

const ArrowRight = styled.img`
  width: 2%;
  height: auto;
  transform: rotate(90deg);
  position: absolute;
  right: 31%;
  top: 36%;
`;

const Tooltip = styled.div`
  width: 29%;
  background: #0E1736;
  border-radius: 5px;
  box-shadow: inset 0px 4px 2px rgba(0, 0, 0, 0.25);
  padding-left: 2.7%;
  padding-right: 2.7%;
  padding-top: 2.4%;
  padding-bottom: 2.4%;
  color: #E8E9F8;
  text-transform: uppercase;
  font-weight: 700;
  margin: 1vw;
`;

const Caption = styled.caption`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0;
  color: #ffffff;
  text-align: center;
`;

const Button = styled.a`
  display: block;

`;

const Container = styled.div`
  position: relative;
`;

const Slide3 = styled.section`
  padding-bottom: 10%;
  text-align: center;

  .cetered {
    margin-left: auto;
    margin-right: auto;
  }
  .note-example {
    width: 61%;
  }

  .edit-example {
    position: relative;
    margin-top: -11%;
  }

  .capt-s3-1 {
    position: absolute;
    right: 8%;
    top: 11%;
    height: 5%;
    width: 13.6%;
  }
  .capt-s3-2 {
    position: absolute;
    height: 14%;
    width: 16%;
    top: 34%;
    left: 42%;
    text-align: center;
    text-transform: uppercase;
    font-weight: 700;
  }
  .capt-s3-3 {
    position: absolute;
    height: 10%;
    width: 14%;
    left: 11%;
    top: 61%;
    text-align: center;
  }
  .capt-s3-4 {
    position: absolute;
    height: 10%;
    width: 14%;
    left: 74%;
    top: 61%;
    text-align: center;
    margin: 0;
  }
  
  .bottomTooltip {
    margin-top: -21%;
    position: relative;

  }
`;
const Slide4 = styled.section`
  text-align: center;
  position: relative;

  H3 {
    padding-bottom: 2%;
  }

  Img {
    width: 74%;
  }

  .curveArrow {
    position: absolute;
    top: -19%;
    left: 5%;
    right: 58.5%;
  }
`;
const Slide5 = styled.section`
  .img1 {
    position: absolute;
    width: 60%;
    right: 0%;
    top: 3%;
  }
  .img2 {
    width: 100%;
    margin-left: -24%;
  }
`;
const Slide6 = styled.section`
  position: relative;

  H3 {
    padding-bottom: 3%;
  }
  .tooltip-right {
    position: absolute;
    right: 0;
    font-size: 0.7rem;
    text-align: center;
    padding-top: 1.4%;
    padding-bottom: 0.4%;

    img {
      width: 12%;
    }
  }
  .tooltip-left {
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 0.7rem;
    text-align: center;
    padding-top: 0.4%;
    padding-bottom: 1.4%;
    img {
      width: 12%;
    }
  }

  Figure {
    Img {
      padding-right: 8%;
      padding-bottom: 5%;
    }
  }
`;

const Footer = styled.footer`
  width: 100%;
  max-width: calc(100vh*1.1);
  margin: auto;
  text-align: center;
  padding-bottom: 10%;

  H3 {
    padding-bottom: 3%;
  span {
    color: #96ffff;
  }
  }
`;

export class LoginPageComponent extends Component {
  render() {
    const authHandler = this.props.isGoogleApiInitialized ? this.props.requestAuthorization : null;
    return (
      <Main>
        <Section>
          <Slide1 />
          <Slide2 />
          <Slide3>
            <H2><b>Edit Notes Content</b>
              <br />
              And Attach Files
            </H2>
            <Figure>
              <Img className='note-example' src={slide3img1} />
            </Figure>
            <div>
              <ArrowUp src={arrow} />
              <Tooltip className='cetered'>
                <svg viewBox="0 0 155 19"><text x="0" y="17" fill="#ffffff" font="bold">Edit Note Content</text></svg>
                </Tooltip>
              <ArrowDown src={arrow} />
            </div>
            <Figure className='edit-example'>
              <Img src={slide3img2} />
              <Caption>
                <div className='capt-s3-1'>
                  <svg viewBox="0 0 100 21">
                    <text x="0" y="15" fill="#96ffff">Neural</text>
                    <text x="47" y="15" fill="#ffffff">Notes</text>
                  </svg>
                </div>
                <div className='capt-s3-2'>
                  <svg viewBox="0 0 100 49">
                    <text x="10" y="22" fill="#ffffff">Vacation</text>
                    <text x="30" y="43" fill="#ffffff">2018</text>
                  </svg>
                </div>
                <div className='capt-s3-3'>Hotel<br />Booking.pdf</div>
                <div className='capt-s3-4'>Airplane<br />ticket.pdf</div>
              </Caption>
            </Figure>
            <div className='bottomTooltip'>
              <ArrowLeft src={arrow} />
              <Tooltip className='cetered'><svg viewBox="0 0 155 19"><text x="23" y="17" fill="#ffffff" font="bold">Attach files</text></svg></Tooltip>
              <ArrowRight src={arrow} />
            </div>
          </Slide3>
          <Slide4>
            <H3>All notes and files are stored
              <br />
              <b>in your Google Drive</b>
            </H3>
            <Figure>
              <Img src={slide4} />
            </Figure>
            <figure className='curveArrow'>
              <img src={arrowCurve} />
            </figure>
          </Slide4>
          <Slide5>
            <Container>
            <Figure className='img1'>
              <Img src={slide5img1} />
            </Figure>
            <Figure  className='img2'>
              <Img src={slide5img2} />
            </Figure>
            </Container>
          </Slide5>
          <Slide6>
            <H3>Frequently used notes
              <br />
              get bigger
            </H3>
            <Container>
            <Tooltip className='tooltip-right'>
              OLd unused notes
                <br/>
                are 
                <span> small</span>
                <br />
                <ArrowDown src={arrow} />
            </Tooltip>
            <Figure>
              <Img src={slide6} />
            </Figure>
            <Tooltip className='tooltip-left'>
                <ArrowUp src={arrow} />
                <br />
              Recent, frequently
                <br />
                used notes are 
                <span> big</span>
            </Tooltip>
            </Container>
          </Slide6>
          <Footer>
            <H3><span>Neural</span>Notes is open source and free</H3>
            <Button onClick={authHandler}><span><img src={iconGoogle} /></span>Sing up with Google</Button>
          </Footer>
        </Section>
      </Main>
    );
  }
}

LoginPageComponent.propTypes = {
  isGoogleApiInitialized: PropTypes.bool.isRequired,
  requestAuthorization: PropTypes.func.isRequired
};
