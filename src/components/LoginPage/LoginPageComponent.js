import React, { useState } from 'react';

import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import COLORS from 'components/LoginPage/colors';
import iconGoogle from 'components/LoginPage/images/icon-google.svg';
import Slide1 from 'components/LoginPage/Slide1';
import Slide2 from 'components/LoginPage/Slide2';
import Slide3 from 'components/LoginPage/Slide3';
import Slide4 from 'components/LoginPage/Slide4';
//import Slide5 from 'components/LoginPage/Slide5';
import Motivation from 'components/LoginPage/Motivation';
import { ASPECT_RATIO } from 'components/LoginPage/slideComponents';
import { FONT_SIZE } from 'components/LoginPage/slideComponents';
import ContactIcons from './ContactIcons';
import Button from '@material-ui/core/Button';
import TermsOfServiceDialog from './TermsOfServiceDialog';
import PrivacyPolicyDialog from './PrivacyPolicyDialog';
import AcceptTermsDialog from './AcceptTermsDialog';

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
  font-size: ${FONT_SIZE.H2};
  text-align: center;
  color: ${COLORS.white};
`;

// 2% - indent for image positioning
// 92% - image height without vertical indention
// 4% - vertical indention
// 0.75% - horizontal indention
const LoginButton = css`
  font-size: 1rem;
  cursor: pointer;
  color: ${COLORS.white};
  color: black;
  background-color: white;
  border: none;
  border-radius: 0.5em;
  padding: 0.5em 1em;

  img {
    height: 2em;
    vertical-align: middle;
    margin-right: 1em;
  }

  span {
    vertical-align: middle;
    line-height: 100%;
  }

  @media (min-width: 1024px) {
    font-size: 1.5rem;
    padding: 1.5em;
  }
`;

const GoogleLoginButton = styled.button`
  ${LoginButton}
  float: right;
  margin: 0.5em;
  @media (min-width: 1024px) {
    font-size: 1rem;
    padding: 1em;
  }
`;

const GoogleSignUp = styled.button`
  ${LoginButton}
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
  }
  .aqua {
    color: ${COLORS.aqua};
  }
`;

const ContactsFooter = styled.div`
  padding: 1em;
  text-align: right;
`;

const TermsOfServiceFooter = styled.div`
  text-align: right;

  button {
    margin: 1em;
    @media (max-width: 1024px) {
      font-size: 0.5rem !important;
      font-size: ${FONT_SIZE.H3}!important;
      margin: 0.5rem;
    }
  }
`;

export const LoginPageComponent = ({
  isGoogleApiInitialized,
  requestAuthorization,
}) => {
  const [isTermsOfServiceDialogOpen, setIsTermsOfServiceDialogOpen] = useState(
    false,
  );
  const [isPrivacyPolicyDialogOpen, setIsPrivacyPolicyDialogOpen] = useState(
    false,
  );
  const [isAcceptTermsDialogOpen, setIsAcceptTermsDialogOpen] = useState(false);

  const handleSignUpClick = () => {
    setIsAcceptTermsDialogOpen(true);
  };

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
        <div style={{ clear: 'both' }}></div>
        <Slide1 />
        <Slide2 />
        <Slide3 />
        <Slide4 />
        <Motivation />
        <Footer>
          <H3>
            <span className="aqua">Neural</span>Notes is{' '}
            <span className="aqua">free</span> up to 100 notes
          </H3>
          <GoogleSignUp type="button" onClick={handleSignUpClick}>
            <img src={iconGoogle} />
            <span>Sign up with Google</span>
          </GoogleSignUp>
        </Footer>
        <ContactsFooter>
          <ContactIcons />
        </ContactsFooter>
        <TermsOfServiceFooter>
          <Button
            size="small"
            onClick={() => setIsTermsOfServiceDialogOpen(true)}>
            Terms of service
          </Button>
          <Button
            size="small"
            onClick={() => setIsPrivacyPolicyDialogOpen(true)}>
            Privacy policy
          </Button>
        </TermsOfServiceFooter>
      </Article>
      <TermsOfServiceDialog
        open={isTermsOfServiceDialogOpen}
        onClose={() => setIsTermsOfServiceDialogOpen(false)}
      />
      <PrivacyPolicyDialog
        open={isPrivacyPolicyDialogOpen}
        onClose={() => setIsPrivacyPolicyDialogOpen(false)}
      />
      <AcceptTermsDialog
        open={isAcceptTermsDialogOpen}
        onClose={() => setIsAcceptTermsDialogOpen(false)}
        onAccept={authHandler}
        openTermsOfService={() => setIsTermsOfServiceDialogOpen(true)}
        openPrivacyPolicy={() => setIsPrivacyPolicyDialogOpen(true)}
      />
    </Main>
  );
};

LoginPageComponent.propTypes = {
  requestAuthorization: PropTypes.func.isRequired,
};
