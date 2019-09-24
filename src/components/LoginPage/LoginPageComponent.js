import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { respondTo } from "_respondTo";
import slide1 from "components/LoginPage/images/slide-1.svg";
import slide2 from "components/LoginPage/images/slide-2.svg";
import slide3description from "components/LoginPage/images/slide-3-description.svg";
import slide4 from "components/LoginPage/images/slide-4.png";

console.log("slide1", slide1);

const OuterWrapper = styled.div`
  background-color: #131c3e;
`;

const MainHeader = styled.h1`
  display: block;
  font-family: Roboto;
  font-weight: 100;
  font-size: 1.5rem;
  line-height: 42px;
  text-align: center;
  color: #ffffff;
  padding-top: 40px;
  padding-bottom: 50px;

  b {
    color: #96ffff;
  }

  ${respondTo.xs`
    font-size: 2rem;
  `}
  ${respondTo.sm`
    font-size: 3rem;
  `}
  ${respondTo.xl`
    font-size: 4rem;
  `}
`;

const LoginButton = styled.a`
  width: 250px;
  display: block;
  marginleft: 20px;
  float: right;
  margintop: 15px;
`;

const ImgSlide = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 370px;
  ${respondTo.xs`
    width: 450px;
  `}
  ${respondTo.sm`
    width: 630px;
  `}
  ${respondTo.xl`
    width: 850px;
  `}
`;

const MediumHeader = styled.h2`
  display: block;
  font-family: Roboto;
  font-weight: 400;
  font-size: 1.2rem;
  line-height: 1.5rem;
  text-align: center;
  color: #ffffff;
  padding-top: 40px;
  padding-bottom: 50px;

  ${respondTo.xs`
    font-size: 1.7rem;
    line-height: 2rem;
  `}
  ${respondTo.sm`
    font-size: 2rem;
    line-height: 3rem;
  `}
  ${respondTo.xl`
    font-size: 3rem;
    line-height: 4rem;
  `}
`;

const ImgSubSlide = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 370px;
  ${respondTo.xs`
    width: 450px;
  `}
`;

export class LoginPageComponent extends Component {
  render() {
    const authHandler = this.props.isGoogleApiInitialized
      ? this.props.requestAuthorization
      : null;
    return (
      <OuterWrapper>
        <div className="container-fluid">
          <MainHeader>
            <b>Neural</b>Notes
          </MainHeader>

          <div style={{ textAlign: "center" }}>
            <ImgSlide src={slide1}></ImgSlide>

            <MediumHeader>
              <b>Create Notes</b>
              <br />
              As A Mind Map
            </MediumHeader>
            <ImgSlide src={slide2}></ImgSlide>
            <MediumHeader>
              <b>Edit Notes Content</b>
              <br />
              And Attach Files
            </MediumHeader>
            <ImgSubSlide src={slide3description}></ImgSubSlide>

            <div className="slide"></div>
            <div className="slide">
              <h2>Single place for notes and files</h2>
              <div className="slide-text">
                <p>
                  In NeuralNotes, every folder has a text file for the notes
                </p>
                <p>
                  It is displayed in a built-in text editor when a folder is
                  selected
                </p>
              </div>
              <img src={slide4} style={{ width: "100%", maxWidth: "750px" }} />
            </div>
          </div>

          <h2 style={{ textAlign: "center" }}>
            Sign up to NeuralNotes for free
          </h2>
          <LoginButton
            onClick={authHandler}
            className="btn btn-social btn-lg btn-google"
          >
            <span className="fa fa-google" />
            Sign in with Google
          </LoginButton>
        </div>
      </OuterWrapper>
    );
  }
}

LoginPageComponent.propTypes = {
  isGoogleApiInitialized: PropTypes.bool.isRequired,
  requestAuthorization: PropTypes.func.isRequired
};
