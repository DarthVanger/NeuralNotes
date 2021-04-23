import React from 'react';

import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import COLORS from 'components/LoginPage/colors';
import iconGoogle from 'components/LoginPage/images/icon-google.svg';
import Slide1 from 'components/LoginPage/Slide1';
import Slide2 from 'components/LoginPage/Slide2';
import Slide3 from 'components/LoginPage/Slide3';
import Slide4 from 'components/LoginPage/Slide4';
import Slide5 from 'components/LoginPage/Slide5';
import { ASPECT_RATIO } from 'components/LoginPage/slideComponents';
import { FONT_SIZE } from 'components/LoginPage/slideComponents';

const Main = styled.main`
  width: 100%;
  background-color: ${COLORS.rainfull};

  .h1,
  .h2,
  .h3,
  h1,
  h2,
  h3 {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  figure {
    margin: auto;
  }

  .h2,
  .h3,
  .h4,
  .h5,
  .h6,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 500;
  }
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
const Button = css`
  color: ${COLORS.white};
  background-color: ${COLORS.blue};
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
    box-sizing: border-box;
  }

  span {
    vertical-align: middle;
    line-height: 100%;
    font-size: 3vmin;
  }
`;

const GoogleLoginButton = styled.button`
  ${Button}
  position: absolute;
  right: 2rem;
  top: 1rem;
`;

const GoogleSignUp = styled.button`
  ${Button}
  margin: auto;
`;

const Footer = styled.footer`
  width: 100%;
  max-width: calc(100vh * ${ASPECT_RATIO});
  margin: auto;
  text-align: center;
  padding-bottom: 10%;

  h3 {
    padding-bottom: 3%;

    span {
      color: ${COLORS.aqua};
    }
  }
`;

export const LoginPageComponent = ({
  isGoogleApiInitialized,
  requestAuthorization,
}) => {
  const authHandler = () => {
    console.log('isGoogleApiInitialized: ', isGoogleApiInitialized);
    if (isGoogleApiInitialized) {
      requestAuthorization();
    } else {
      console.log(
        "Google api is not yet initialized, can't authorize user yet!",
      );
    }
  };

  return (
    <Main>
      <Article>
        <GoogleLoginButton type="button" onClick={authHandler}>
          <img src={iconGoogle} />
          <span>Login</span>
        </GoogleLoginButton>
        <Slide1 />
        <Slide2 />
        <Slide3 />
        <Slide4 />
        <Slide5 />
        <Footer>
          <H3>
            <span>Neural</span>Notes is open source and free
          </H3>
          <GoogleSignUp type="button" onClick={authHandler}>
            <img src={iconGoogle} />
            <span>Sign up with Google</span>
          </GoogleSignUp>
        </Footer>
      </Article>
    </Main>
  );
};

LoginPageComponent.propTypes = {
  requestAuthorization: PropTypes.func.isRequired,
};
