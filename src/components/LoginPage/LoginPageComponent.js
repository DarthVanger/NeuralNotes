import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Slide1 from 'components/LoginPage/Slide1';
import Slide2 from 'components/LoginPage/Slide2';
import Slide3 from 'components/LoginPage/Slide3';
import Slide4 from 'components/LoginPage/Slide4';
import arrow from 'components/LoginPage/images/arrow.svg'
import slide5 from 'components/LoginPage/images/slide-5.svg';
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

const ArrowUp = styled.img`
  width: 2%;
  height: auto;
`;

const ArrowDown = styled.img`
  width: 2%;
  height: auto;
  transform: rotate(180deg);
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

const Button = styled.a`
  display: block;

`;

const Container = styled.div`
  position: relative;
`;

const Slide5 = styled.section`
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
          <Slide3 />
          <Slide4 />
          <Slide5>
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
              <Img src={slide5} />
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
          </Slide5>
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
