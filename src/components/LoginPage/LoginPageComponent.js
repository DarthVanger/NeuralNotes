import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Slide1 from 'components/LoginPage/Slide1';
import Slide2 from 'components/LoginPage/Slide2';
import Slide3 from 'components/LoginPage/Slide3';
import Slide4 from 'components/LoginPage/Slide4';
import Slide5 from 'components/LoginPage/Slide5';
import iconGoogle from 'components/LoginPage/images/icon-google.svg';
import COLORS from 'components/LoginPage/colors';

const Main = styled.main`
  width: 100%;
  background-color: ${COLORS.rainfull};
  font-family: Roboto;
`;

const Article = styled.article`
  width: 100%;
  max-width: calc(100vh*1.1);
  margin: auto;
`;

const H3 = styled.h3`
  padding-bottom: 7%;
  font-size: calc(13px + (24 - 13)*(100vw - 375px)/(1200 - 375));
  text-align: center;
  color: ${COLORS.white};
`;

const Button = styled.button`
  color: ${COLORS.white};
  background-color: ${COLORS.blue};
  margin: auto;
  position: relative;
  border: none;
  border-radius: 5px;
  padding: 2vmin 4vmin 2vmin calc(9vmin + 8px);

  img {
    height: calc(100% - 8px);
    background-color: ${COLORS.white};
    position: absolute;
    padding: 3%;
    left: 4px;
    top: 4px;
  }
  
  span {
    vertical-align: middle;
    line-height: 100%;
    font-size: 3vmin;
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
      color: ${COLORS.aqua};
    }
  }
`;

export class LoginPageComponent extends Component {
  render() {
    const authHandler = this.props.isGoogleApiInitialized ? this.props.requestAuthorization : null;
    return (
      <Main>
        <Article>
          <Slide1 />
          <Slide2 />
          <Slide3 />
          <Slide4 />
          <Slide5 />
          <Footer>
            <H3><span>Neural</span>Notes is open source and free</H3>
            <Button type="button" onClick={authHandler}><img src={iconGoogle} /><span>Sing up with Google</span></Button>
          </Footer>
        </Article>
      </Main>
    );
  }
}

LoginPageComponent.propTypes = {
  isGoogleApiInitialized: PropTypes.bool.isRequired,
  requestAuthorization: PropTypes.func.isRequired
};
