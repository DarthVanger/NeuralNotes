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
import { ASPECT_RATIO} from 'components/LoginPage/slideComponents';
import { FONT_SIZE } from 'components/LoginPage/slideComponents';

const Main = styled.main`
  width: 100%;
  background-color: ${COLORS.rainfull};
  font-family: Roboto;
`;

const Article = styled.article`
  width: 100%;
  max-width: calc(100vh * ${ASPECT_RATIO});
  margin: auto;
`;

const H3 = styled.h3`
  padding-bottom: 7%;
  font-size: ${FONT_SIZE.H3};
  text-align: center;
  color: ${COLORS.white};
`;

// 2% - indent for image positioning
// 92% - image height without vertical indention
// 4% - vertical indention
// 0.75% - horizontal indention
const GoogleLoginButton = styled.button`
  color: ${COLORS.white};
  background-color: ${COLORS.blue};
  margin: auto;
  position: relative;
  border: none;
  border-radius: 0.4vmin;
  padding: 2vmin 4vmin 2vmin calc(9vmin + 2%); 

  img {
    height: 92%;
    background-color: ${COLORS.white};
    position: absolute;
    padding: 3%;
    left: 0.75%;
    top: 4%;
    border-radius: 0.4vmin;
  }
  
  span {
    vertical-align: middle;
    line-height: 100%;
    font-size: 3vmin;
  }
`;

const Footer = styled.footer`
  width: 100%;
  max-width: calc(100vh * ${ASPECT_RATIO});
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
            <GoogleLoginButton type="button" onClick={authHandler}>
              <img src={iconGoogle} />
              <span>Sing up with Google</span>
            </GoogleLoginButton>
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
